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
public class CategoriesController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly ISiteContext _site;

    public CategoriesController(AppDbContext db, ISiteContext site)
    {
        _db = db;
        _site = site;
    }

    // GET /api/categories
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll()
    {
        var categories = await _db.Categories
            .OrderBy(c => c.Name)
            .Select(c => new { c.Id, c.Name, c.Slug, c.CreatedAt })
            .ToListAsync();

        return Ok(categories);
    }

    // GET /api/categories/{id}
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var category = await _db.Categories.FindAsync(id);
        if (category is null) return NotFound();
        return Ok(new { category.Id, category.Name, category.Slug, category.CreatedAt });
    }

    // POST /api/categories
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CategoryRequest request)
    {
        var slug = string.IsNullOrWhiteSpace(request.Slug)
            ? GenerateSlug(request.Name)
            : request.Slug.Trim().ToLowerInvariant();

        if (await _db.Categories.AnyAsync(c => c.Slug == slug))
            return Conflict(new { error = "Bu slug zaten kullanılıyor." });

        var category = new Category
        {
            Name = request.Name.Trim(),
            Slug = slug,
            SiteId = _site.SiteId,
            CreatedAt = DateTime.UtcNow
        };

        _db.Categories.Add(category);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = category.Id },
            new { category.Id, category.Name, category.Slug });
    }

    // PUT /api/categories/{id}
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] CategoryRequest request)
    {
        var category = await _db.Categories.FindAsync(id);
        if (category is null) return NotFound();

        var slug = string.IsNullOrWhiteSpace(request.Slug)
            ? GenerateSlug(request.Name)
            : request.Slug.Trim().ToLowerInvariant();

        if (await _db.Categories.AnyAsync(c => c.Slug == slug && c.Id != id))
            return Conflict(new { error = "Bu slug zaten kullanılıyor." });

        category.Name = request.Name.Trim();
        category.Slug = slug;
        category.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return Ok(new { category.Id, category.Name, category.Slug });
    }

    // DELETE /api/categories/{id}
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var category = await _db.Categories.FindAsync(id);
        if (category is null) return NotFound();

        var hasPost = await _db.Posts.AnyAsync(p => p.CategoryId == id);
        if (hasPost)
            return BadRequest(new { error = "Bu kategoriye bağlı yazılar var. Önce yazıları silin veya taşıyın." });

        _db.Categories.Remove(category);
        await _db.SaveChangesAsync();
        return NoContent();
    }

    private static string GenerateSlug(string name) =>
        System.Text.RegularExpressions.Regex
            .Replace(name.ToLowerInvariant().Trim(), @"[^a-z0-9]+", "-")
            .Trim('-');
}

public record CategoryRequest(string Name, string? Slug);