namespace MehmetAsker.Domain.Entities;

public enum AppointmentStatus
{
    Pending,
    Confirmed,
    Cancelled,
    Completed
}

public class Appointment : SiteBoundEntity
{
    public Guid ServiceId { get; set; }
    public Service Service { get; set; } = null!;

    public string CustomerName { get; set; } = null!;
    public string CustomerEmail { get; set; } = null!;
    public DateTime ScheduledAt { get; set; }
    public int DurationMinutes { get; set; } = 60;
    public AppointmentStatus Status { get; set; } = AppointmentStatus.Pending;
    public bool IsFreeSession { get; set; } = false;
    public string? StripePaymentIntentId { get; set; }
    public string? Notes { get; set; }
}
