namespace Seeagle.Application.Reports;

public interface IReportTypeService
{
    Task<ReportTypeDto> CreateAsync(CreateReportTypeRequest request, CancellationToken cancellationToken);
}