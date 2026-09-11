using Seeagle.Application.Common;

namespace Seeagle.Application.Reports;

public interface IReportTypeQueryService
{
    Task<PagedResult<ReportTypeDto>> GetReportTypesAsync(int pageNumber, int pageSize,
        CancellationToken cancellationToken, bool onlyActive = false);
}