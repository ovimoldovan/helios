namespace Seeagle.Application.ReportTypes;

public interface IReportTypeService
{
    Task<ReportTypeDto> CreateAsync(CreateReportTypeRequest request, CancellationToken cancellationToken);
}