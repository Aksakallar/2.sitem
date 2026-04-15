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
public class PostsController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly ISiteContext _site;

    public PostsController(AppDbContext db, ISiteContext site)
    {
        _db = db;
        _site = site;
    }

    // GET /api/posts?page=1&pageSize=20&published=true
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] bool? published = null)
    {
        var query = _db.Posts
            .Include(p => p.Category)
            .AsQueryable();

        if (published.HasValue)
            query = query.Where(p => p.IsPublished == published.Value);

        var total = await query.CountAsync();

        var posts = await query
            .OrderByDescending(p => p.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(p => new
            {
                p.Id, p.Title, p.Slug, p.Summary, p.CoverImage,
                p.Tags, p.IsPublished, p.PublishedAt, p.CreatedAt,
                category = p.Category == null ? null : new { p.Category.Id, p.Category.Name }
            })
            .ToListAsync();

        return Ok(new { total, page, pageSize, data = posts });
    }

    // GET /api/posts/{id}
    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetById(Guid id)
    {
        var post = await _db.Posts
            .Include(p => p.Category)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (post is null) return NotFound();

        return Ok(new
        {
            post.Id, post.Title, post.Slug, post.Content,
            post.Summary, post.CoverImage, post.Tags, post.IsPublished,
            post.PublishedAt, post.CreatedAt, post.CategoryId,
            category = post.Category == null ? null : new { post.Category.Id, post.Category.Name }
        });
    }

    // POST /api/posts
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] PostRequest request)
    {
        var slug = string.IsNullOrWhiteSpace(request.Slug)
            ? GenerateSlug(request.Title)
            : request.Slug.Trim().ToLowerInvariant();

        if (await _db.Posts.AnyAsync(p => p.Slug == slug))
            return Conflict(new { error = "Bu slug zaten kullanılıyor." });

        var post = new Post
        {
            Title = request.Title.Trim(),
            Slug = slug,
            Content = request.Content,
            Summary = request.Summary?.Trim(),
            CoverImage = request.CoverImage?.Trim(),
            Tags = request.Tags?.Trim(),
            IsPublished = request.IsPublished,
            PublishedAt = request.IsPublished ? DateTime.UtcNow : null,
            CategoryId = request.CategoryId,
            SiteId = _site.SiteId,
            CreatedAt = DateTime.UtcNow
        };

        _db.Posts.Add(post);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = post.Id },
            new { post.Id, post.Title, post.Slug, post.IsPublished });
    }

    // PUT /api/posts/{id}
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] PostRequest request)
    {
        var post = await _db.Posts.FindAsync(id);
        if (post is null) return NotFound();

        var slug = string.IsNullOrWhiteSpace(request.Slug)
            ? GenerateSlug(request.Title)
            : request.Slug.Trim().ToLowerInvariant();

        if (await _db.Posts.AnyAsync(p => p.Slug == slug && p.Id != id))
            return Conflict(new { error = "Bu slug zaten kullanılıyor." });

        var wasUnpublished = !post.IsPublished;

        post.Title = request.Title.Trim();
        post.Slug = slug;
        post.Content = request.Content;
        post.Summary = request.Summary?.Trim();
        post.CoverImage = request.CoverImage?.Trim();
        post.Tags = request.Tags?.Trim();
        post.CategoryId = request.CategoryId;
        post.IsPublished = request.IsPublished;
        post.UpdatedAt = DateTime.UtcNow;

        // İlk kez yayınlanıyorsa PublishedAt'ı set et
        if (request.IsPublished && wasUnpublished)
            post.PublishedAt = DateTime.UtcNow;
        else if (!request.IsPublished)
            post.PublishedAt = null;

        await _db.SaveChangesAsync();
        return Ok(new { post.Id, post.Title, post.Slug, post.IsPublished });
    }

    // PATCH /api/posts/{id}/publish
    [HttpPatch("{id:guid}/publish")]
    public async Task<IActionResult> TogglePublish(Guid id)
    {
        var post = await _db.Posts.FindAsync(id);
        if (post is null) return NotFound();

        post.IsPublished = !post.IsPublished;
        post.PublishedAt = post.IsPublished ? DateTime.UtcNow : null;
        post.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return Ok(new { post.Id, post.IsPublished, post.PublishedAt });
    }

    // DELETE /api/posts/{id}
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var post = await _db.Posts.FindAsync(id);
        if (post is null) return NotFound();

        _db.Posts.Remove(post);
        await _db.SaveChangesAsync();
        return NoContent();
    }

    private static string GenerateSlug(string title) =>
        System.Text.RegularExpressions.Regex
            .Replace(title.ToLowerInvariant().Trim(), @"[^a-z0-9]+", "-")
            .Trim('-');
}

public record PostRequest(
    string Title,
    string Content,
    string? Slug,
    string? Summary,
    string? CoverImage,
    string? Tags,
    bool IsPublished,
    Guid? CategoryId
);