namespace MehmetAsker.Domain.Entities;

public class Subscriber : SiteBoundEntity
{
    public string Email { get; set; } = null!;
    public string? Name { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime? ConfirmedAt { get; set; }
}