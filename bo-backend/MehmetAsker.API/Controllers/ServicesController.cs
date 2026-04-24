using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MehmetAsker.DataAccess.Context;
using MehmetAsker.Domain.Entities;
using MehmetAsker.Application.Interfaces;

namespace MehmetAsker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ServicesController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly ISiteContext _site;

    public ServicesController(AppDbContext db, ISiteContext site)
    {
        _db = db;
        _site = site;
    }

    // GET /api/services  — public (React site)
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll([FromQuery] bool? activeOnly = true)
    {
        var query = _db.Services.AsQueryable();

        if (activeOnly == true)
            query = query.Where(s => s.IsActive);

        var services = await query
            .OrderBy(s => s.SortOrder)
            .ThenBy(s => s.CreatedAt)
            .Select(s => new
            {
                s.Id, s.Title, s.Description, s.IsActive,
                s.Price, s.Currency, s.DurationMinutes, s.SortOrder
            })
            .ToListAsync();

        return Ok(services);
    }

    // GET /api/services/{id}
    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetById(Guid id)
    {
        var service = await _db.Services.FindAsync(id);
        if (service is null) return NotFound();
        return Ok(service);
    }

    // POST /api/services  — BO only
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromBody] ServiceRequest request)
    {
        var service = new Service
        {
            Title = request.Title.Trim(),
            Description = request.Description?.Trim(),
            IsActive = request.IsActive,
            Price = request.Price,
            Currency = (request.Currency ?? "EUR").Trim().ToUpperInvariant(),
            DurationMinutes = request.DurationMinutes,
            SortOrder = request.SortOrder,
            SiteId = _site.SiteId,
            CreatedAt = DateTime.UtcNow
        };

        _db.Services.Add(service);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = service.Id },
            new { service.Id, service.Title, service.IsActive });
    }

    // PUT /api/services/{id}  — BO only
    [HttpPut("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> Update(Guid id, [FromBody] ServiceRequest request)
    {
        var service = await _db.Services.FindAsync(id);
        if (service is null) return NotFound();

        service.Title = request.Title.Trim();
        service.Description = request.Description?.Trim();
        service.IsActive = request.IsActive;
        service.Price = request.Price;
        service.Currency = (request.Currency ?? "EUR").Trim().ToUpperInvariant();
        service.DurationMinutes = request.DurationMinutes;
        service.SortOrder = request.SortOrder;
        service.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return Ok(new { service.Id, service.Title, service.IsActive });
    }

    // PATCH /api/services/{id}/toggle  — aktif/pasif
    [HttpPatch("{id:guid}/toggle")]
    [Authorize]
    public async Task<IActionResult> Toggle(Guid id)
    {
        var service = await _db.Services.FindAsync(id);
        if (service is null) return NotFound();

        service.IsActive = !service.IsActive;
        service.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return Ok(new { service.Id, service.IsActive });
    }

    // DELETE /api/services/{id}  — BO only
    [HttpDelete("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> Delete(Guid id)
    {
        var service = await _db.Services.FindAsync(id);
        if (service is null) return NotFound();

        var hasAppointments = await _db.Appointments.AnyAsync(a => a.ServiceId == id);
        if (hasAppointments)
            return Conflict(new { error = "Bu hizmetin randevuları var, silinemez." });

        _db.Services.Remove(service);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}

public record ServiceRequest(
    string Title,
    string? Description,
    bool IsActive,
    decimal Price,
    string? Currency,
    int? DurationMinutes,
    int SortOrder
);