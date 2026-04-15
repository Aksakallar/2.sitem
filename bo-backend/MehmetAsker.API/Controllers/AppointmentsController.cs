using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MehmetAsker.DataAccess.Context;
using MehmetAsker.Domain.Entities;
using MehmetAsker.Application.Interfaces;

namespace MehmetAsker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AppointmentsController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly ISiteContext _site;

    public AppointmentsController(AppDbContext db, ISiteContext site)
    {
        _db = db;
        _site = site;
    }

    // GET /api/appointments  — BO: tüm randevular
    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetAll(
        [FromQuery] AppointmentStatus? status = null,
        [FromQuery] Guid? serviceId = null)
    {
        var query = _db.Appointments.Include(a => a.Service).AsQueryable();

        if (status.HasValue)
            query = query.Where(a => a.Status == status.Value);

        if (serviceId.HasValue)
            query = query.Where(a => a.ServiceId == serviceId.Value);

        var appointments = await query
            .OrderByDescending(a => a.ScheduledAt)
            .Select(a => new
            {
                a.Id,
                a.CustomerName,
                a.CustomerEmail,
                a.ScheduledAt,
                a.DurationMinutes,
                a.Status,
                a.IsFreeSession,
                a.Notes,
                Service = new { a.Service.Id, a.Service.Title },
                a.CreatedAt
            })
            .ToListAsync();

        return Ok(appointments);
    }

    // GET /api/appointments/{id}
    [HttpGet("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> GetById(Guid id)
    {
        var appointment = await _db.Appointments
            .Include(a => a.Service)
            .FirstOrDefaultAsync(a => a.Id == id);

        if (appointment is null) return NotFound();
        return Ok(appointment);
    }

    // POST /api/appointments  — public (React site ziyaretçisi randevu alır)
    [HttpPost]
    [AllowAnonymous]
    public async Task<IActionResult> Create([FromBody] AppointmentRequest request)
    {
        var service = await _db.Services.FindAsync(request.ServiceId);
        if (service is null) return BadRequest(new { error = "Hizmet bulunamadı." });
        if (!service.IsActive) return BadRequest(new { error = "Bu hizmet şu an aktif değil." });

        // Seçilen saatte çakışma kontrolü
        var conflictEnd = request.ScheduledAt.AddMinutes(request.DurationMinutes);
        var hasConflict = await _db.Appointments.AnyAsync(a =>
            a.ServiceId == request.ServiceId &&
            a.Status != AppointmentStatus.Cancelled &&
            a.ScheduledAt < conflictEnd &&
            a.ScheduledAt.AddMinutes(a.DurationMinutes) > request.ScheduledAt);

        if (hasConflict)
            return Conflict(new { error = "Seçilen saat dolu. Lütfen başka bir saat seçin." });

        // İlk seans ücretsiz mi kontrolü
        var hasPreviousFreeSession = await _db.Appointments.AnyAsync(a =>
            a.CustomerEmail == request.CustomerEmail &&
            a.ServiceId == request.ServiceId &&
            a.IsFreeSession);

        var isFreeSession = service.IsFreeFirstSession && !hasPreviousFreeSession;

        var appointment = new Appointment
        {
            ServiceId = request.ServiceId,
            CustomerName = request.CustomerName.Trim(),
            CustomerEmail = request.CustomerEmail.Trim().ToLowerInvariant(),
            ScheduledAt = request.ScheduledAt,
            DurationMinutes = request.DurationMinutes > 0 ? request.DurationMinutes : service.SessionDurationMinutes,
            Status = isFreeSession ? AppointmentStatus.Confirmed : AppointmentStatus.Pending,
            IsFreeSession = isFreeSession,
            Notes = request.Notes?.Trim(),
            SiteId = service.SiteId,
            CreatedAt = DateTime.UtcNow
        };

        _db.Appointments.Add(appointment);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = appointment.Id }, new
        {
            appointment.Id,
            appointment.CustomerName,
            appointment.ScheduledAt,
            appointment.Status,
            appointment.IsFreeSession,
            message = isFreeSession
                ? "Ücretsiz ilk seansiniz onaylandı!"
                : "Randevunuz alındı. Ödeme sonrası onaylanacaktır."
        });
    }

    // PATCH /api/appointments/{id}/status  — BO: durum güncelle
    [HttpPatch("{id:guid}/status")]
    [Authorize]
    public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] UpdateStatusRequest request)
    {
        var appointment = await _db.Appointments.FindAsync(id);
        if (appointment is null) return NotFound();

        appointment.Status = request.Status;
        appointment.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return Ok(new { appointment.Id, appointment.Status });
    }

    // DELETE /api/appointments/{id}  — BO only
    [HttpDelete("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> Delete(Guid id)
    {
        var appointment = await _db.Appointments.FindAsync(id);
        if (appointment is null) return NotFound();

        _db.Appointments.Remove(appointment);
        await _db.SaveChangesAsync();
        return NoContent();
    }

    // GET /api/appointments/availability?serviceId=...&date=2026-04-15
    [HttpGet("availability")]
    [AllowAnonymous]
    public async Task<IActionResult> GetAvailability([FromQuery] Guid serviceId, [FromQuery] DateTime date)
    {
        var service = await _db.Services.FindAsync(serviceId);
        if (service is null) return NotFound();

        // Pazartesi-Cuma, 09:00-20:00 arası saatler
        if (date.DayOfWeek == DayOfWeek.Saturday || date.DayOfWeek == DayOfWeek.Sunday)
            return Ok(new { available = new List<string>(), message = "Hafta sonu çalışılmıyor." });

        // O gün alınan randevular
        var dayStart = date.Date;
        var dayEnd = dayStart.AddDays(1);

        var takenSlots = await _db.Appointments
            .Where(a => a.ServiceId == serviceId &&
                        a.Status != AppointmentStatus.Cancelled &&
                        a.ScheduledAt >= dayStart &&
                        a.ScheduledAt < dayEnd)
            .Select(a => a.ScheduledAt)
            .ToListAsync();

        // 09:00'dan 20:00'a kadar saatlik slotlar
        var allSlots = Enumerable.Range(9, 11) // 9,10,...,19
            .Select(h => date.Date.AddHours(h))
            .ToList();

        var available = allSlots
            .Where(slot => !takenSlots.Any(t =>
                t < slot.AddMinutes(service.SessionDurationMinutes) &&
                t.AddMinutes(service.SessionDurationMinutes) > slot))
            .Select(slot => slot.ToString("HH:mm"))
            .ToList();

        return Ok(new { date = date.Date.ToString("yyyy-MM-dd"), available });
    }
}

public record AppointmentRequest(
    Guid ServiceId,
    string CustomerName,
    string CustomerEmail,
    DateTime ScheduledAt,
    int DurationMinutes,
    string? Notes
);

public record UpdateStatusRequest(AppointmentStatus Status);