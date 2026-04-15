using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MehmetAsker.Application.Interfaces;
using MehmetAsker.DataAccess.Context;
using MehmetAsker.Domain.Entities;

namespace MehmetAsker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private const int MaxFailedAttempts = 3;
    private const int LockMinutes = 15;
    private const int RefreshTokenExpiryDays = 7;

    private readonly AppDbContext _db;
    private readonly IJwtService _jwt;

    public AuthController(AppDbContext db, IJwtService jwt)
    {
        _db = db;
        _jwt = jwt;
    }

    // POST /api/auth/login
    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var email = request.Email.Trim().ToLowerInvariant();

        // AdminUser'ı doğrudan Sites ile birlikte çek (global query filter bypass — SiteId henüz yok)
        var admin = await _db.AdminUsers
            .IgnoreQueryFilters()
            .Include(a => a.Site)
            .FirstOrDefaultAsync(a => a.Email == email);

        if (admin is null)
            return Unauthorized(new { error = "E-posta veya şifre hatalı." });

        // Hesap kilitli mi?
        if (admin.LockedUntil.HasValue && admin.LockedUntil > DateTime.UtcNow)
        {
            var remaining = (int)(admin.LockedUntil.Value - DateTime.UtcNow).TotalMinutes + 1;
            return Unauthorized(new
            {
                error = $"Hesap geçici olarak kilitlendi. {remaining} dakika sonra tekrar deneyin."
            });
        }

        // Şifre kontrolü
        if (!BCrypt.Net.BCrypt.Verify(request.Password, admin.PasswordHash))
        {
            admin.FailedLoginAttempts++;

            if (admin.FailedLoginAttempts >= MaxFailedAttempts)
            {
                admin.LockedUntil = DateTime.UtcNow.AddMinutes(LockMinutes);
                admin.FailedLoginAttempts = 0;
                await _db.SaveChangesAsync();
                return Unauthorized(new
                {
                    error = $"Çok fazla hatalı deneme. Hesap {LockMinutes} dakika kilitlendi."
                });
            }

            await _db.SaveChangesAsync();
            var left = MaxFailedAttempts - admin.FailedLoginAttempts;
            return Unauthorized(new { error = $"E-posta veya şifre hatalı. {left} hakkınız kaldı." });
        }

        // Başarılı giriş — sıfırla
        admin.FailedLoginAttempts = 0;
        admin.LockedUntil = null;
        admin.LastLogin = DateTime.UtcNow;

        // Eski refresh token'ları temizle
        var oldTokens = await _db.RefreshTokens
            .Where(r => r.AdminUserId == admin.Id && !r.IsRevoked)
            .ToListAsync();
        foreach (var t in oldTokens) t.IsRevoked = true;

        // Yeni token'lar
        var accessToken = _jwt.GenerateAccessToken(admin.Id, admin.Email, admin.Role, admin.SiteId);
        var refreshTokenValue = _jwt.GenerateRefreshToken();

        _db.RefreshTokens.Add(new RefreshToken
        {
            AdminUserId = admin.Id,
            Token = refreshTokenValue,
            ExpiresAt = DateTime.UtcNow.AddDays(RefreshTokenExpiryDays)
        });

        await _db.SaveChangesAsync();

        return Ok(new
        {
            accessToken,
            refreshToken = refreshTokenValue,
            expiresIn = 480 * 60, // saniye
            admin = new
            {
                id = admin.Id,
                email = admin.Email,
                role = admin.Role,
                siteId = admin.SiteId,
                siteDomain = admin.Site?.Domain
            }
        });
    }

    // POST /api/auth/refresh
    [HttpPost("refresh")]
    [AllowAnonymous]
    public async Task<IActionResult> Refresh([FromBody] RefreshRequest request)
    {
        var token = await _db.RefreshTokens
            .IgnoreQueryFilters()
            .Include(r => r.AdminUser)
            .ThenInclude(a => a.Site)
            .FirstOrDefaultAsync(r =>
                r.Token == request.RefreshToken &&
                !r.IsRevoked &&
                r.ExpiresAt > DateTime.UtcNow);

        if (token is null)
            return Unauthorized(new { error = "Geçersiz veya süresi dolmuş refresh token." });

        // Token rotation — eskiyi iptal et, yenisini yaz
        token.IsRevoked = true;

        var admin = token.AdminUser;
        var newAccessToken = _jwt.GenerateAccessToken(admin.Id, admin.Email, admin.Role, admin.SiteId);
        var newRefreshValue = _jwt.GenerateRefreshToken();

        _db.RefreshTokens.Add(new RefreshToken
        {
            AdminUserId = admin.Id,
            Token = newRefreshValue,
            ExpiresAt = DateTime.UtcNow.AddDays(RefreshTokenExpiryDays)
        });

        await _db.SaveChangesAsync();

        return Ok(new
        {
            accessToken = newAccessToken,
            refreshToken = newRefreshValue,
            expiresIn = 480 * 60
        });
    }

    // POST /api/auth/change-password
    [HttpPost("change-password")]
    [Authorize]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
    {
        var userId = Guid.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value
            ?? User.FindFirst("sub")?.Value ?? "");

        var admin = await _db.AdminUsers
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(a => a.Id == userId);

        if (admin is null)
            return NotFound(new { error = "Kullanıcı bulunamadı." });

        if (!BCrypt.Net.BCrypt.Verify(request.CurrentPassword, admin.PasswordHash))
            return BadRequest(new { error = "Mevcut şifre hatalı." });

        admin.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
        await _db.SaveChangesAsync();

        return Ok(new { message = "Şifre başarıyla güncellendi." });
    }

    // POST /api/auth/logout
    [HttpPost("logout")]
    [Authorize]
    public async Task<IActionResult> Logout([FromBody] LogoutRequest request)
    {
        var token = await _db.RefreshTokens
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(r => r.Token == request.RefreshToken && !r.IsRevoked);

        if (token is not null)
        {
            token.IsRevoked = true;
            await _db.SaveChangesAsync();
        }

        return Ok(new { message = "Çıkış yapıldı." });
    }
}

public record LoginRequest(string Email, string Password);
public record RefreshRequest(string RefreshToken);
public record LogoutRequest(string RefreshToken);
public record ChangePasswordRequest(string CurrentPassword, string NewPassword);
