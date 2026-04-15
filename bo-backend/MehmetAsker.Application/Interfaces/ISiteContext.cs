namespace MehmetAsker.Application.Interfaces;

public interface ISiteContext
{
    Guid SiteId { get; set; }
    bool IsResolved { get; }
}