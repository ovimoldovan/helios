using Seeagle.Application.Common;
using Seeagle.Domain.ReportTypes;

namespace Seeagle.Application.ReportTypes;

public sealed class ReportTypeService(IRepository<ReportType> repository) : IReportTypeService
{
    public async Task<ReportTypeDto> CreateAsync(CreateReportTypeRequest request, CancellationToken cancellationToken)
    {
        var reportType = new ReportType(request.Name);
        await repository.AddAsync(reportType, cancellationToken);

        return new ReportTypeDto(reportType.Id, reportType.Name);
    }
}