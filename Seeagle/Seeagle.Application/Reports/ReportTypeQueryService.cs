using Microsoft.EntityFrameworkCore;
using Seeagle.Application.Common;
using Seeagle.Domain.Reports;

namespace Seeagle.Application.Reports;

public class ReportTypeQueryService : IReportTypeQueryService
{
    private readonly IRepository<ReportType> _reportTypeRepository;

    public ReportTypeQueryService(IRepository<ReportType> reportTypeRepository)
    {
        _reportTypeRepository = reportTypeRepository;
    }

    public async Task<PagedResult<ReportTypeDto>> GetReportTypesAsync(int pageNumber, int pageSize, CancellationToken cancellationToken, bool onlyActive = false)
    {
        var query = _reportTypeRepository.GetAllQueryable();

        query = onlyActive ? query.Where(type => type.IsActive == true) : query;

        var totalCount = await query.CountAsync(cancellationToken);

        var reportTypes = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Select(type => new ReportTypeDto(type.Id, type.Name, type.IsActive))
            .ToListAsync(cancellationToken);

        return new PagedResult<ReportTypeDto>(reportTypes, totalCount, pageNumber, pageSize);
    }
}