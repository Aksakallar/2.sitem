namespace MehmetAsker.Domain.Entities;

public class SocialLink : SiteBoundEntity
{
    public string Platform { get; set; } = null!;  // "GitHub", "LinkedIn", "Twitter" vb.
    public string Url { get; set; } = null!;
    public string? IconName { get; set; }
    public int SortOrder { get; set; } = 0;
    public bool IsVisible { get; set; } = true;
}