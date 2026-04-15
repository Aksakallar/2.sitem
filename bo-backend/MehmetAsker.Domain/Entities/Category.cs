namespace MehmetAsker.Domain.Entities;

public class Category : SiteBoundEntity
{
    public string Name { get; set; } = null!;
    public string Slug { get; set; } = null!;

    public ICollection<Post> Posts { get; set; } = new List<Post>();
}