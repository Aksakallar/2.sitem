namespace MehmetAsker.Domain.Entities;

public enum TrackType
{
    Music,
    Podcast
}

public class Track : SiteBoundEntity
{
    public string Title { get; set; } = null!;
    public string? Artist { get; set; }
    public string? Description { get; set; }
    public string AudioUrl { get; set; } = null!;
    public string? CoverUrl { get; set; }
    public int DurationSeconds { get; set; } = 0;
    public TrackType Type { get; set; } = TrackType.Music;
    public int? EpisodeNumber { get; set; }
    public bool IsPublished { get; set; } = false;
    public int SortOrder { get; set; } = 0;
}