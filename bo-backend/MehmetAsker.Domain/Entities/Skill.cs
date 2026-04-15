namespace MehmetAsker.Domain.Entities;

public class Skill : SiteBoundEntity
{
    public string Name { get; set; } = null!;
    public string? IconUrl { get; set; }
    public string Category { get; set; } = "General"; // "Frontend", "Backend", "DevOps" vb.
    public int SortOrder { get; set; } = 0;
}