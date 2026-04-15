namespace MehmetAsker.Domain.Entities;

public class AdminUser : SiteBoundEntity
{
    public string Email { get; set; } = null!;
    public string PasswordHash { get; set; } = null!;
    public string Role { get; set; } = "ADMIN";
    public DateTime? LastLogin { get; set; }
    public int FailedLoginAttempts { get; set; } = 0;
    public DateTime? LockedUntil { get; set; }

    // Navigation
    public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
}