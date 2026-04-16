using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MehmetAsker.DataAccess.Context;
using MehmetAsker.Domain.Entities;
using MehmetAsker.Application.Interfaces;

namespace MehmetAsker.API.Controllers;

[ApiController]
[Route("api/subscribers")]
public class SubscribersController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly ISiteContext _site;

    public SubscribersController(AppDbContext db, ISiteContext site)
    {
        _db = db;
        _site = site;
    }

    // POST /api/subscribers — public (ziyaretçi abone olur)
    [HttpPost]
    [AllowAnonymous]
    public async Task<IActionResult> Subscribe([FromBody] SubscribeRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email))
            return BadRequest(new { error = "E-posta adresi zorunludur." });

        var email = request.Email.Trim().ToLowerInvariant();

        var exists = await _db.Subscribers
            .AnyAsync(s => s.Email == email && s.SiteId == _site.SiteId);

        if (exists)
            return Ok(new { success = true, message = "Bu e-posta zaten kayıtlı." });

        var sub = new Subscriber
        {
            Email = email,
            Name = request.Name?.Trim(),
            IsActive = true,
            ConfirmedAt = DateTime.UtcNow,
            SiteId = _site.SiteId,
            CreatedAt = DateTime.UtcNow
        };

        _db.Subscribers.Add(sub);
        await _db.SaveChangesAsync();

        return Ok(new { success = true, message = "Bültene başarıyla abone oldunuz!" });
    }

    // GET /api/subscribers — BO: tüm aboneler
    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetAll()
    {
        var subscribers = await _db.Subscribers
            .OrderByDescending(s => s.CreatedAt)
            .Select(s => new
            {
                s.Id,
                s.Email,
                s.Name,
                s.IsActive,
                s.ConfirmedAt,
                s.CreatedAt
            })
            .ToListAsync();

        return Ok(subscribers);
    }

    // DELETE /api/subscribers/{id} — BO
    [HttpDelete("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> Delete(Guid id)
    {
        var sub = await _db.Subscribers.FindAsync(id);
        if (sub is null) return NotFound();

        _db.Subscribers.Remove(sub);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}

public record SubscribeRequest(string Email, string? Name);