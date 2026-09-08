using Seeagle.Application.Common;
using Seeagle.Domain.Reports;

namespace Seeagle.Application.Reports;

public interface IReportQueryService
{
    Task<IReadOnlyList<ReportDto>> GetApprovedReportsAsync(DateTime fromDate, CancellationToken cancellationToken);
	Task<PagedResult<ReportDto>> GetPublicReportsAsync( int pageNumber, int pageSize, string? status, Guid? areaId, string? sortBy, string? sortOrder, CancellationToken cancellationToken);
}
