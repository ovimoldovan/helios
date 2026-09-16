using Seeagle.Application.Common;
using Seeagle.Domain.Reports;

namespace Seeagle.Application.Reports;

public interface IReportQueryService
{
    Task<IReadOnlyList<Report>> GetApprovedReportsAsync(DateTime fromDate, CancellationToken cancellationToken);
    Task<PagedResult<Report>> GetPublicReportsAsync(
        int pageNumber,
        int pageSize,
        string? status,
        Guid? areaId,
        string? sortBy,
        string? sortOrder,
        CancellationToken cancellationToken);

    Task<PagedResult<Report>> GetAllReportsAsync(
        int pageNumber,
        int pageSize,
        string? sortBy,
        string? sortOrder,
        CancellationToken cancellationToken);
}
