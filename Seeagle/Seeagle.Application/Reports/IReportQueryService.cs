using Seeagle.Application.Common;
using Seeagle.Domain.Reports;

namespace Seeagle.Application.Reports;

public interface IReportQueryService
{
    Task<IReadOnlyList<ReportDto>> GetApprovedReportsAsync(DateTime fromDate, CancellationToken cancellationToken);
    Task<PagedResult<ReportDto>> GetAllReportsAsync(
        int pageNumber,
        int pageSize,
        string? sortBy,
        string? sortOrder,
        CancellationToken cancellationToken);
}
