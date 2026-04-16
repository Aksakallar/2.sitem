using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MehmetAsker.DataAccess.Context;
using MehmetAsker.Application.Interfaces;

namespace MehmetAsker.API.Controllers;

[ApiController]
[Route("api/stats")]
[Authorize]
public class StatsController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly ISiteContext _site;

    public StatsController(AppDbContext db, ISiteContext site)
    {
        _db = db;
        _site = site;
    }

    // GET /api/stats
    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var siteId = _site.SiteId;

        var totalPosts = await _db.Posts.CountAsync(p => p.SiteId == siteId);
        var publishedPosts = await _db.Posts.CountAsync(p => p.SiteId == siteId && p.IsPublished);
        var totalProjects = await _db.Projects.CountAsync(p => p.SiteId == siteId);
        var publishedProjects = await _db.Projects.CountAsync(p => p.SiteId == siteId && p.IsPublished);
        var totalMessages = await _db.ContactMessages.CountAsync(m => m.SiteId == siteId);
        var unreadMessages = await _db.ContactMessages.CountAsync(m => m.SiteId == siteId && !m.IsRead);
        var totalAppointments = await _db.Appointments.CountAsync(a => a.SiteId == siteId);
        var pendingAppointments = await _db.Appointments.CountAsync(a => a.SiteId == siteId && a.Status == MehmetAsker.Domain.Entities.AppointmentStatus.Pending);
        var totalSubscribers = await _db.Subscribers.CountAsync(s => s.SiteId == siteId && s.IsActive);

        return Ok(new
        {
            posts = new { total = totalPosts, published = publishedPosts },
            projects = new { total = totalProjects, published = publishedProjects },
            messages = new { total = totalMessages, unread = unreadMessages },
            appointments = new { total = totalAppointments, pending = pendingAppointments },
            subscribers = new { total = totalSubscribers },
        });
    }
}
