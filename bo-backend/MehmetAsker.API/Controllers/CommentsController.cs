using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MehmetAsker.DataAccess.Context;
using MehmetAsker.Domain.Entities;
using MehmetAsker.Application.Interfaces;

namespace MehmetAsker.API.Controllers;

[ApiController]
[Route("api/comments")]
public class CommentsController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly ISiteContext _site;

    public CommentsController(AppDbContext db, ISiteContext site)
    {
        _db = db;
        _site = site;
    }

    // GET /api/comments — public: onaylı yorumlar (postId opsiyonel)
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetApproved([FromQuery] Guid? postId = null)
    {
        var query = _db.Comments
            .Where(c => c.IsApproved)
            .AsQueryable();

        if (postId.HasValue)
            query = query.Where(c => c.PostId == postId.Value);

        var comments = await query
            .OrderByDescending(c => c.CreatedAt)
            .Select(c => new
            {
                c.Id,
                c.PostId,
                c.AuthorName,
                c.Content,
                c.CreatedAt
            })
            .ToListAsync();

        return Ok(comments);
    }

    // GET /api/comments/all — BO: tüm yorumlar (onaysız dahil)
    [HttpGet("all")]
    [Authorize]
    public async Task<IActionResult> GetAll([FromQuery] bool? approved = null)
    {
        var query = _db.Comments.Include(c => c.Post).AsQueryable();

        if (approved.HasValue)
            query = query.Where(c => c.IsApproved == approved.Value);

        var comments = await query
            .OrderByDescending(c => c.CreatedAt)
            .Select(c => new
            {
                c.Id,
                c.PostId,
                PostTitle = c.Post.Title,
                c.AuthorName,
                c.AuthorEmail,
                c.Content,
                c.IsApproved,
                c.CreatedAt
            })
            .ToListAsync();

        return Ok(comments);
    }

    // POST /api/comments — public (ziyaretçi yorum yapar)
    [HttpPost]
    [AllowAnonymous]
    public async Task<IActionResult> Create([FromBody] CommentRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.AuthorName) ||
            string.IsNullOrWhiteSpace(request.AuthorEmail) ||
            string.IsNullOrWhiteSpace(request.Content))
            return BadRequest(new { error = "Ad, e-posta ve yorum içeriği zorunludur." });

        var post = await _db.Posts.FindAsync(request.PostId);
        if (post is null) return BadRequest(new { error = "Blog yazısı bulunamadı." });

        var comment = new Comment
        {
            PostId = request.PostId,
            AuthorName = request.AuthorName.Trim(),
            AuthorEmail = request.AuthorEmail.Trim().ToLowerInvariant(),
            Content = request.Content.Trim(),
            IsApproved = false,
            SiteId = _site.SiteId,
            CreatedAt = DateTime.UtcNow
        };

        _db.Comments.Add(comment);
        await _db.SaveChangesAsync();

        return Ok(new { success = true, message = "Yorumunuz incelemeye alındı." });
    }

    // PATCH /api/comments/{id}/approve — BO: yorumu onayla
    [HttpPatch("{id:guid}/approve")]
    [Authorize]
    public async Task<IActionResult> Approve(Guid id)
    {
        var comment = await _db.Comments.FindAsync(id);
        if (comment is null) return NotFound();

        comment.IsApproved = true;
        comment.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        return Ok(new { comment.Id, comment.IsApproved });
    }

    // DELETE /api/comments/{id} — BO
    [HttpDelete("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> Delete(Guid id)
    {
        var comment = await _db.Comments.FindAsync(id);
        if (comment is null) return NotFound();

        _db.Comments.Remove(comment);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}

public record CommentRequest(
    Guid PostId,
    string AuthorName,
    string AuthorEmail,
    string Content
);