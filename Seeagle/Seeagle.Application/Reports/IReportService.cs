namespace Seeagle.Application.Reports;

public interface IReportService
{
    Task<ReportDto> CreateAsync(Guid userId, CreateReportRequest request, CancellationToken cancellationToken);
}