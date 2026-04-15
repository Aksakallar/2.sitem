using MehmetAsker.Application.Interfaces;

namespace MehmetAsker.Application.Services;

public class SiteContext : ISiteContext
{
    public Guid SiteId { get; set; }
    public bool IsResolved => SiteId != Guid.Empty;
}