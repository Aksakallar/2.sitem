namespace MehmetAsker.Domain.Entities;

public class Service : SiteBoundEntity
{
    public string Title { get; set; } = null!;
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public string Currency { get; set; } = "EUR";
    public int? DurationMinutes { get; set; }
    public bool IsActive { get; set; } = true;
    public int SortOrder { get; set; } = 0;

    public ICollection<Appointment> Appointments { get; set; } = [];
}
