namespace MehmetAsker.Domain.Entities;

/// <summary>
/// Site başına tek kayıt — Hakkımda sayfası içeriği
/// </summary>
public class AboutInfo : SiteBoundEntity
{
    public string FullName { get; set; } = null!;
    public string Title { get; set; } = null!;       // "Full Stack Developer"
    public string? Bio { get; set; }
    public string? ShortBio { get; set; }            // Kısa tanıtım
    public string? AvatarUrl { get; set; }
    public string? ResumeUrl { get; set; }
    public string? Location { get; set; }
    public string? Email { get; set; }
}