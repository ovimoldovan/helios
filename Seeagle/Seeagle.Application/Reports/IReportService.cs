using Seeagle.Application.Common;

namespace Seeagle.Application.Reports;

public interface IReportService
{
    Task<ReportDto> CreateAsync(Guid userId, CreateReportRequest request, CancellationToken cancellationToken);

    Task<PagedResult<ReportDto>> GetPendingAsync(int pageNumber, int pageSize, CancellationToken cancellationToken);

    Task<ReportDto?> ApproveAsync(Guid id, string priority, CancellationToken cancellationToken);

    Task<ReportDto?> RejectAsync(Guid id, CancellationToken cancellationToken);
    
    Task<ReportDto?> MarkAsSolvedAsync(Guid id, string? message, CancellationToken cancellationToken);
    Task<PagedResult<ReportDto>> GetApprovedReportsAsync(int pageNumber, int pageSize, CancellationToken cancellationToken);
    Task<ReportDto?> SendMessageToReporterAsync(Guid id, string? message, CancellationToken cancellationToken);
    Task<PagedResult<ReportDto>> GetUserReportsAsync(Guid userId, int pageNumber, int pageSize, CancellationToken cancellationToken);
}