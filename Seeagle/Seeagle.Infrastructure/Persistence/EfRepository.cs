using Microsoft.EntityFrameworkCore;
using Seeagle.Application.Common;

namespace Seeagle.Infrastructure.Persistence;

public sealed class EfRepository<T>(SeeagleDbContext dbContext) : IRepository<T> where T : class
{
    public async Task AddAsync(T entity, CancellationToken cancellationToken)
    {
        await dbContext.Set<T>().AddAsync(entity, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<T>> GetAllAsync(CancellationToken cancellationToken)
    {
        return await dbContext.Set<T>().ToListAsync(cancellationToken);
    }

    public async Task UpdateAsync(T entity, CancellationToken cancellationToken)
    {
        dbContext.Set<T>().Update(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(T entity, CancellationToken cancellationToken)
    {
        dbContext.Set<T>().Remove(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
    }
}
