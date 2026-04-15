using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MehmetAsker.DataAccess.Context;
using MehmetAsker.Domain.Entities;

namespace MehmetAsker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SitesController : ControllerBase
{
    private readonly AppDbContext _db;

    public SitesController(AppDbContext db)
    {
        _db = db;
    }

    // GET /api/sites — tüm aktif siteleri listele (auth gerekir)
    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetAll()
    {
        var sites = await _db.Sites
            .AsNoTracking()
            .Where(s => s.IsActive)
            .OrderBy(s => s.Name)
            .Select(s => new { s.Id, s.Name, s.Domain, s.IsActive, s.CreatedAt })
            .ToListAsync();

        return Ok(sites);
    }

    // GET /api/sites/{id}
    [HttpGet("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> GetById(Guid id)
    {
        var site = await _db.Sites
            .AsNoTracking()
            .Where(s => s.Id == id)
            .Select(s => new { s.Id, s.Name, s.Domain, s.IsActive, s.CreatedAt })
            .FirstOrDefaultAsync();

        return site is null ? NotFound() : Ok(site);
    }

    // POST /api/sites — yeni site ekle (auth gerekir)
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromBody] CreateSiteRequest request)
    {
        if (await _db.Sites.AnyAsync(s => s.Domain == request.Domain))
            return Conflict(new { error = $"'{request.Domain}' domain zaten kayıtlı." });

        var site = new Site
        {
            Name = request.Name.Trim(),
            Domain = request.Domain.Trim().ToLowerInvariant(),
            IsActive = true
        };

        _db.Sites.Add(site);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = site.Id },
            new { site.Id, site.Name, site.Domain, site.ApiKey, site.IsActive, site.CreatedAt });
    }

    // PATCH /api/sites/{id}/toggle — aktif/pasif
    [HttpPatch("{id:guid}/toggle")]
    [Authorize]
    public async Task<IActionResult> Toggle(Guid id)
    {
        var site = await _db.Sites.FindAsync(id);
        if (site is null) return NotFound();

        site.IsActive = !site.IsActive;
        site.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        return Ok(new { site.Id, site.IsActive });
    }

    // POST /api/admin/bootstrap — ilk site + admin kullanıcı (tek seferlik, auth yok)
    [HttpPost("/api/admin/bootstrap")]
    [AllowAnonymous]
    public async Task<IActionResult> Bootstrap([FromBody] BootstrapRequest request)
    {
        if (await _db.Sites.AnyAsync())
            return Conflict(new { error = "Bootstrap zaten tamamlandı. Sistem aktif." });

        var site = new Site
        {
            Name = request.SiteName.Trim(),
            Domain = request.Domain.Trim().ToLowerInvariant(),
            IsActive = true
        };
        _db.Sites.Add(site);

        var admin = new AdminUser
        {
            Email = request.AdminEmail.Trim().ToLowerInvariant(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.AdminPassword),
            Role = "ADMIN",
            SiteId = site.Id,
            Site = site
        };
        _db.AdminUsers.Add(admin);

        await _db.SaveChangesAsync();

        return Ok(new
        {
            message = "Bootstrap tamamlandı.",
            siteId = site.Id,
            siteName = site.Name,
            adminEmail = admin.Email
        });
    }
}

public record CreateSiteRequest(string Name, string Domain);

public record BootstrapRequest(
    string SiteName,
    string Domain,
    string AdminEmail,
    string AdminPassword
);