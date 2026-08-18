using Seeagle.Application.Common;
using Seeagle.Domain.Reports;

namespace Seeagle.Application.Reports;

public interface IReportQueryService
{
    Task<IReadOnlyList<ReportDto>> GetApprovedReportsAsync(CancellationToken cancellationToken);
}