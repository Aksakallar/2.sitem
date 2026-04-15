namespace MehmetAsker.Domain.Entities;

/// <summary>
/// SiteID gerektiren tüm entity'ler bu sınıftan türer.
/// EF Core global query filter bu sınıf üzerinden uygulanır.
/// </summary>
public abstract class SiteBoundEntity : BaseEntity
{
    public Guid SiteId { get; set; }
    public Site Site { get; set; } = null!;
}