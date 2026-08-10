namespace Seeagle.Application.Reports;

public interface IReportService
{
    Task<ReportDto> CreateAsync(CreateReportRequest request, CancellationToken cancellationToken);
    Task<IReadOnlyList<ReportDto>> GetPendingAsync(CancellationToken cancellationToken);
    Task<ReportDto?> ApproveAsync(Guid id, CancellationToken cancellationToken);
    Task<ReportDto?> RejectAsync(Guid id, CancellationToken cancellationToken);
}