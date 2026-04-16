namespace MehmetAsker.Domain.Entities;

public class Comment : SiteBoundEntity
{
    public Guid PostId { get; set; }
    public Post Post { get; set; } = null!;

    public string AuthorName { get; set; } = null!;
    public string AuthorEmail { get; set; } = null!;
    public string Content { get; set; } = null!;
    public bool IsApproved { get; set; } = false;
}