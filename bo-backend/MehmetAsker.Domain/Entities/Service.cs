namespace MehmetAsker.Domain.Entities;

public class Service : SiteBoundEntity
{
    public string Title { get; set; } = null!;
    public string? Description { get; set; }
    public bool IsActive { get; set; } = true;
    public bool IsFreeFirstSession { get; set; } = true;
    public int SessionDurationMinutes { get; set; } = 60;
    public int PackageHours { get; set; } = 15;
    public decimal PackagePriceEur { get; set; } = 750;
    public int SortOrder { get; set; } = 0;

    public ICollection<Appointment> Appointments { get; set; } = [];
}
