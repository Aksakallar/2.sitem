using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MehmetAsker.DataAccess.Context;
using MehmetAsker.Domain.Entities;
using MehmetAsker.Application.Interfaces;

namespace MehmetAsker.API.Controllers;

[ApiController]
[Route("api/tracks")]
public class TracksController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly ISiteContext _site;

    public TracksController(AppDbContext db, ISiteContext site)
    {
        _db = db;
        _site = site;
    }

    // GET /api/tracks — public (React site)
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll(
        [FromQuery] string? type = null,
        [FromQuery] bool publishedOnly = true)
    {
        var query = _db.Tracks.AsQueryable();

        if (publishedOnly)
            query = query.Where(t => t.IsPublished);

        if (!string.IsNullOrWhiteSpace(type) && Enum.TryParse<TrackType>(type, true, out var trackType))
            query = query.Where(t => t.Type == trackType);

        var tracks = await query
            .OrderBy(t => t.SortOrder)
            .ThenByDescending(t => t.CreatedAt)
            .Select(t => new
            {
                t.Id,
                t.Title,
                t.Artist,
                t.Description,
                t.AudioUrl,
                t.CoverUrl,
                t.DurationSeconds,
                Type = t.Type.ToString(),
                t.EpisodeNumber,
                t.IsPublished,
                t.SortOrder,
                t.CreatedAt
            })
            .ToListAsync();

        return Ok(tracks);
    }

    // POST /api/tracks — BO
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromBody] TrackRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Title) || string.IsNullOrWhiteSpace(request.AudioUrl))
            return BadRequest(new { error = "Başlık ve ses URL'si zorunludur." });

        if (!Enum.TryParse<TrackType>(request.Type, true, out var trackType))
            trackType = TrackType.Music;

        var track = new Track
        {
            Title = request.Title.Trim(),
            Artist = request.Artist?.Trim(),
            Description = request.Description?.Trim(),
            AudioUrl = request.AudioUrl.Trim(),
            CoverUrl = request.CoverUrl?.Trim(),
            DurationSeconds = request.DurationSeconds,
            Type = trackType,
            EpisodeNumber = request.EpisodeNumber,
            IsPublished = request.IsPublished,
            SortOrder = request.SortOrder,
            SiteId = _site.SiteId,
            CreatedAt = DateTime.UtcNow
        };

        _db.Tracks.Add(track);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetAll), new { }, new { track.Id });
    }

    // PUT /api/tracks/{id} — BO
    [HttpPut("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> Update(Guid id, [FromBody] TrackRequest request)
    {
        var track = await _db.Tracks.FindAsync(id);
        if (track is null) return NotFound();

        if (!Enum.TryParse<TrackType>(request.Type, true, out var trackType))
            trackType = TrackType.Music;

        track.Title = request.Title.Trim();
        track.Artist = request.Artist?.Trim();
        track.Description = request.Description?.Trim();
        track.AudioUrl = request.AudioUrl.Trim();
        track.CoverUrl = request.CoverUrl?.Trim();
        track.DurationSeconds = request.DurationSeconds;
        track.Type = trackType;
        track.EpisodeNumber = request.EpisodeNumber;
        track.IsPublished = request.IsPublished;
        track.SortOrder = request.SortOrder;
        track.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return Ok(new { track.Id });
    }

    // PATCH /api/tracks/{id}/toggle — BO: yayın durumunu değiştir
    [HttpPatch("{id:guid}/toggle")]
    [Authorize]
    public async Task<IActionResult> Toggle(Guid id)
    {
        var track = await _db.Tracks.FindAsync(id);
        if (track is null) return NotFound();

        track.IsPublished = !track.IsPublished;
        track.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        return Ok(new { track.Id, track.IsPublished });
    }

    // DELETE /api/tracks/{id} — BO
    [HttpDelete("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> Delete(Guid id)
    {
        var track = await _db.Tracks.FindAsync(id);
        if (track is null) return NotFound();

        _db.Tracks.Remove(track);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}

public record TrackRequest(
    string Title,
    string? Artist,
    string? Description,
    string AudioUrl,
    string? CoverUrl,
    int DurationSeconds,
    string Type,
    int? EpisodeNumber,
    bool IsPublished,
    int SortOrder
);