using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MehmetAsker.DataAccess.Context;
using MehmetAsker.Domain.Entities;
using MehmetAsker.Application.Interfaces;

namespace MehmetAsker.API.Controllers;

[ApiController]
[Route("api/messages")]
public class ContactMessagesController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly ISiteContext _site;

    public ContactMessagesController(AppDbContext db, ISiteContext site)
    {
        _db = db;
        _site = site;
    }

    // POST /api/messages — public (ziyaretçi mesaj bırakır)
    [HttpPost]
    [AllowAnonymous]
    public async Task<IActionResult> Create([FromBody] ContactMessageRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name) ||
            string.IsNullOrWhiteSpace(request.Email) ||
            string.IsNullOrWhiteSpace(request.Message))
            return BadRequest(new { error = "Ad, e-posta ve mesaj zorunludur." });

        var msg = new ContactMessage
        {
            Name = request.Name.Trim(),
            Email = request.Email.Trim().ToLowerInvariant(),
            Subject = request.Subject?.Trim() ?? "(Konu belirtilmedi)",
            Message = request.Message.Trim(),
            SiteId = _site.SiteId,
            IpAddress = HttpContext.Connection.RemoteIpAddress?.ToString(),
            CreatedAt = DateTime.UtcNow
        };

        _db.ContactMessages.Add(msg);
        await _db.SaveChangesAsync();

        return Ok(new { success = true, message = "Mesajınız iletildi." });
    }

    // GET /api/messages — BO: tüm mesajlar
    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetAll([FromQuery] bool? unread = null)
    {
        var query = _db.ContactMessages.AsQueryable();

        if (unread == true)
            query = query.Where(m => !m.IsRead);

        var messages = await query
            .OrderByDescending(m => m.CreatedAt)
            .Select(m => new
            {
                m.Id,
                m.Name,
                m.Email,
                m.Subject,
                m.Message,
                m.IsRead,
                m.CreatedAt
            })
            .ToListAsync();

        return Ok(messages);
    }

    // PATCH /api/messages/{id}/read — BO: okundu işaretle
    [HttpPatch("{id:guid}/read")]
    [Authorize]
    public async Task<IActionResult> MarkRead(Guid id)
    {
        var msg = await _db.ContactMessages.FindAsync(id);
        if (msg is null) return NotFound();

        msg.IsRead = true;
        msg.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        return Ok(new { msg.Id, msg.IsRead });
    }

    // DELETE /api/messages/{id} — BO
    [HttpDelete("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> Delete(Guid id)
    {
        var msg = await _db.ContactMessages.FindAsync(id);
        if (msg is null) return NotFound();

        _db.ContactMessages.Remove(msg);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}

public record ContactMessageRequest(
    string Name,
    string Email,
    string? Subject,
    string Message
);