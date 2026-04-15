namespace MehmetAsker.Domain.Entities;

public class Project : SiteBoundEntity
{
    public string Title { get; set; } = null!;
    public string Slug { get; set; } = null!;
    public string? Description { get; set; }
    public string? CoverImage { get; set; }
    public string? LiveUrl { get; set; }
    public string? GitHubUrl { get; set; }
    public string? Tags { get; set; } // JSON array olarak saklanır: ["React","Node.js"]
    public bool IsFeatured { get; set; } = false;
    public bool IsPublished { get; set; } = false;
    public int SortOrder { get; set; } = 0;
}