namespace MehmetAsker.Domain.Entities;

public class ContactMessage : SiteBoundEntity
{
    public string Name { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Subject { get; set; } = null!;
    public string Message { get; set; } = null!;
    public bool IsRead { get; set; } = false;
    public string? IpAddress { get; set; }
}