namespace Seeagle.Application.Reports;

public interface IReportService
{
    Task<ReportDto> CreateAsync(CreateReportRequest request, CancellationToken cancellationToken);
}