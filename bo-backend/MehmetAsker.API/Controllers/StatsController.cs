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

        return Ok(new
        {
            posts = new { total = totalPosts, published = publishedPosts },
            projects = new { total = totalProjects, published = publishedProjects },
        });
    }
}
