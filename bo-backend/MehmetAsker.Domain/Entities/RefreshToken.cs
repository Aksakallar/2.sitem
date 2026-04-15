namespace MehmetAsker.Domain.Entities;

public class RefreshToken : BaseEntity
{
    public Guid AdminUserId { get; set; }
    public string Token { get; set; } = null!;
    public DateTime ExpiresAt { get; set; }
    public bool IsRevoked { get; set; } = false;

    // Navigation
    public AdminUser AdminUser { get; set; } = null!;
}