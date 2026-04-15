namespace MehmetAsker.Domain.Entities;

public class Post : SiteBoundEntity
{
    public string Title { get; set; } = null!;
    public string Slug { get; set; } = null!;
    public string Content { get; set; } = null!;
    public string? Summary { get; set; }
    public string? CoverImage { get; set; }
    public bool IsPublished { get; set; } = false;
    public DateTime? PublishedAt { get; set; }

    public string? Tags { get; set; }  // Virgülle ayrılmış: "React,SASS,UI Design"

    public Guid? CategoryId { get; set; }
    public Category? Category { get; set; }
}