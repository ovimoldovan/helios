using Seeagle.Application.Common;
using Seeagle.Domain.Reports;

namespace Seeagle.Application.Tests.Reports;

public sealed class InMemoryReportRepository : IRepository<Report>
{
    private readonly List<Report> _reports = new();

    public Task AddAsync(Report entity, CancellationToken cancellationToken)
    {
        _reports.Add(entity);
        return Task.CompletedTask;
    }

    public Task<IReadOnlyList<Report>> GetAllAsync(CancellationToken cancellationToken)
    {
        return Task.FromResult<IReadOnlyList<Report>>(_reports);
    }

    public Task UpdateAsync(Report entity, CancellationToken cancellationToken)
    {
        
        return Task.CompletedTask;
    }

    public Task DeleteAsync(Report entity, CancellationToken cancellationToken)
    {
        _reports.Remove(entity);
        return Task.CompletedTask;
    }
}