using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MehmetAsker.DataAccess.Context;
using MehmetAsker.Domain.Entities;
using MehmetAsker.Application.Interfaces;

namespace MehmetAsker.API.Controllers;

[ApiController]
[Route("api/settings")]
[Authorize]
public class SettingsController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly ISiteContext _site;

    public SettingsController(AppDbContext db, ISiteContext site)
    {
        _db = db;
        _site = site;
    }

    // ─── About ──────────────────────────────────────────────────────────────

    // GET /api/settings/about
    [HttpGet("about")]
    [AllowAnonymous]
    public async Task<IActionResult> GetAbout()
    {
        var about = await _db.AboutInfos.FirstOrDefaultAsync();
        if (about is null) return Ok(null);
        return Ok(about);
    }

    // PUT /api/settings/about — upsert (yoksa oluştur, varsa güncelle)
    [HttpPut("about")]
    public async Task<IActionResult> UpsertAbout([FromBody] AboutRequest request)
    {
        var about = await _db.AboutInfos.FirstOrDefaultAsync();

        if (about is null)
        {
            about = new AboutInfo
            {
                SiteId = _site.SiteId,
                CreatedAt = DateTime.UtcNow
            };
            _db.AboutInfos.Add(about);
        }

        about.FullName = request.FullName.Trim();
        about.Title = request.Title.Trim();
        about.Bio = request.Bio?.Trim();
        about.ShortBio = request.ShortBio?.Trim();
        about.AvatarUrl = request.AvatarUrl?.Trim();
        about.ResumeUrl = request.ResumeUrl?.Trim();
        about.Location = request.Location?.Trim();
        about.Email = request.Email?.Trim();
        about.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return Ok(about);
    }

    // ─── Skills ─────────────────────────────────────────────────────────────

    // GET /api/settings/skills
    [HttpGet("skills")]
    [AllowAnonymous]
    public async Task<IActionResult> GetSkills()
    {
        var skills = await _db.Skills
            .OrderBy(s => s.SortOrder).ThenBy(s => s.Name)
            .ToListAsync();
        return Ok(skills);
    }

    // POST /api/settings/skills
    [HttpPost("skills")]
    public async Task<IActionResult> CreateSkill([FromBody] SkillRequest request)
    {
        var skill = new Skill
        {
            Name = request.Name.Trim(),
            IconUrl = request.IconUrl?.Trim(),
            Category = request.Category?.Trim() ?? "General",
            SortOrder = request.SortOrder,
            SiteId = _site.SiteId,
            CreatedAt = DateTime.UtcNow
        };
        _db.Skills.Add(skill);
        await _db.SaveChangesAsync();
        return Ok(skill);
    }

    // PUT /api/settings/skills/{id}
    [HttpPut("skills/{id:guid}")]
    public async Task<IActionResult> UpdateSkill(Guid id, [FromBody] SkillRequest request)
    {
        var skill = await _db.Skills.FindAsync(id);
        if (skill is null) return NotFound();

        skill.Name = request.Name.Trim();
        skill.IconUrl = request.IconUrl?.Trim();
        skill.Category = request.Category?.Trim() ?? "General";
        skill.SortOrder = request.SortOrder;
        skill.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return Ok(skill);
    }

    // DELETE /api/settings/skills/{id}
    [HttpDelete("skills/{id:guid}")]
    public async Task<IActionResult> DeleteSkill(Guid id)
    {
        var skill = await _db.Skills.FindAsync(id);
        if (skill is null) return NotFound();
        _db.Skills.Remove(skill);
        await _db.SaveChangesAsync();
        return NoContent();
    }

    // ─── Social Links ────────────────────────────────────────────────────────

    // GET /api/settings/social
    [HttpGet("social")]
    [AllowAnonymous]
    public async Task<IActionResult> GetSocial()
    {
        var links = await _db.SocialLinks
            .OrderBy(s => s.SortOrder).ThenBy(s => s.Platform)
            .ToListAsync();
        return Ok(links);
    }

    // POST /api/settings/social
    [HttpPost("social")]
    public async Task<IActionResult> CreateSocial([FromBody] SocialLinkRequest request)
    {
        var link = new SocialLink
        {
            Platform = request.Platform.Trim(),
            Url = request.Url.Trim(),
            IconName = request.IconName?.Trim(),
            SortOrder = request.SortOrder,
            IsVisible = request.IsVisible,
            SiteId = _site.SiteId,
            CreatedAt = DateTime.UtcNow
        };
        _db.SocialLinks.Add(link);
        await _db.SaveChangesAsync();
        return Ok(link);
    }

    // PUT /api/settings/social/{id}
    [HttpPut("social/{id:guid}")]
    public async Task<IActionResult> UpdateSocial(Guid id, [FromBody] SocialLinkRequest request)
    {
        var link = await _db.SocialLinks.FindAsync(id);
        if (link is null) return NotFound();

        link.Platform = request.Platform.Trim();
        link.Url = request.Url.Trim();
        link.IconName = request.IconName?.Trim();
        link.SortOrder = request.SortOrder;
        link.IsVisible = request.IsVisible;
        link.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return Ok(link);
    }

    // DELETE /api/settings/social/{id}
    [HttpDelete("social/{id:guid}")]
    public async Task<IActionResult> DeleteSocial(Guid id)
    {
        var link = await _db.SocialLinks.FindAsync(id);
        if (link is null) return NotFound();
        _db.SocialLinks.Remove(link);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}

public record AboutRequest(
    string FullName,
    string Title,
    string? Bio,
    string? ShortBio,
    string? AvatarUrl,
    string? ResumeUrl,
    string? Location,
    string? Email
);

public record SkillRequest(
    string Name,
    string? IconUrl,
    string? Category,
    int SortOrder
);

public record SocialLinkRequest(
    string Platform,
    string Url,
    string? IconName,
    int SortOrder,
    bool IsVisible
);