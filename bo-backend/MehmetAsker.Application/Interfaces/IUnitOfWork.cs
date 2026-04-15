using MehmetAsker.Domain.Entities;

namespace MehmetAsker.Application.Interfaces;

public interface IUnitOfWork : IDisposable
{
    IRepository<T> Repository<T>() where T : BaseEntity;
    Task<int> SaveChangesAsync();
}