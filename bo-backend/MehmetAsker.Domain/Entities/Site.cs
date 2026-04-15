namespace MehmetAsker.Domain.Entities;

public class Site : BaseEntity
{
    public string Name { get; set; } = null!;
    public string Domain { get; set; } = null!;
    public string ApiKey { get; set; } = Guid.NewGuid().ToString();
    public bool IsActive { get; set; } = true;

    // Navigation
    public ICollection<AdminUser> AdminUsers { get; set; } = new List<AdminUser>();
}