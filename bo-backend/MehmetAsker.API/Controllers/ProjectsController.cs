using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MehmetAsker.DataAccess.Context;
using MehmetAsker.Domain.Entities;
using MehmetAsker.Application.Interfaces;

namespace MehmetAsker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProjectsController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly ISiteContext _site;

    public ProjectsController(AppDbContext db, ISiteContext site)
    {
        _db = db;
        _site = site;
    }

    // GET /api/projects
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll([FromQuery] bool? published = null)
    {
        var query = _db.Projects.AsQueryable();

        if (published.HasValue)
            query = query.Where(p => p.IsPublished == published.Value);

        var projects = await query
            .OrderBy(p => p.SortOrder)
            .ThenByDescending(p => p.CreatedAt)
            .Select(p => new
            {
                p.Id, p.Title, p.Slug, p.Description, p.CoverImage,
                p.LiveUrl, p.GitHubUrl, p.Tags,
                p.IsFeatured, p.IsPublished, p.SortOrder, p.CreatedAt
            })
            .ToListAsync();

        return Ok(projects);
    }

    // GET /api/projects/{id}
    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetById(Guid id)
    {
        var project = await _db.Projects.FindAsync(id);
        if (project is null) return NotFound();
        return Ok(project);
    }

    // POST /api/projects
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] ProjectRequest request)
    {
        var slug = string.IsNullOrWhiteSpace(request.Slug)
            ? GenerateSlug(request.Title)
            : request.Slug.Trim().ToLowerInvariant();

        if (await _db.Projects.AnyAsync(p => p.Slug == slug))
            return Conflict(new { error = "Bu slug zaten kullanılıyor." });

        var project = new Project
        {
            Title = request.Title.Trim(),
            Slug = slug,
            Description = request.Description?.Trim(),
            CoverImage = request.CoverImage?.Trim(),
            LiveUrl = request.LiveUrl?.Trim(),
            GitHubUrl = request.GitHubUrl?.Trim(),
            Tags = request.Tags?.Trim(),
            IsFeatured = request.IsFeatured,
            IsPublished = request.IsPublished,
            SortOrder = request.SortOrder,
            SiteId = _site.SiteId,
            CreatedAt = DateTime.UtcNow
        };

        _db.Projects.Add(project);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = project.Id },
            new { project.Id, project.Title, project.Slug, project.IsPublished });
    }

    // PUT /api/projects/{id}
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] ProjectRequest request)
    {
        var project = await _db.Projects.FindAsync(id);
        if (project is null) return NotFound();

        var slug = string.IsNullOrWhiteSpace(request.Slug)
            ? GenerateSlug(request.Title)
            : request.Slug.Trim().ToLowerInvariant();

        if (await _db.Projects.AnyAsync(p => p.Slug == slug && p.Id != id))
            return Conflict(new { error = "Bu slug zaten kullanılıyor." });

        project.Title = request.Title.Trim();
        project.Slug = slug;
        project.Description = request.Description?.Trim();
        project.CoverImage = request.CoverImage?.Trim();
        project.LiveUrl = request.LiveUrl?.Trim();
        project.GitHubUrl = request.GitHubUrl?.Trim();
        project.Tags = request.Tags?.Trim();
        project.IsFeatured = request.IsFeatured;
        project.IsPublished = request.IsPublished;
        project.SortOrder = request.SortOrder;
        project.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return Ok(new { project.Id, project.Title, project.Slug, project.IsPublished });
    }

    // DELETE /api/projects/{id}
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var project = await _db.Projects.FindAsync(id);
        if (project is null) return NotFound();

        _db.Projects.Remove(project);
        await _db.SaveChangesAsync();
        return NoContent();
    }

    private static string GenerateSlug(string title) =>
        System.Text.RegularExpressions.Regex
            .Replace(title.ToLowerInvariant().Trim(), @"[^a-z0-9]+", "-")
            .Trim('-');
}

public record ProjectRequest(
    string Title,
    string? Slug,
    string? Description,
    string? CoverImage,
    string? LiveUrl,
    string? GitHubUrl,
    string? Tags,
    bool IsFeatured,
    bool IsPublished,
    int SortOrder
);