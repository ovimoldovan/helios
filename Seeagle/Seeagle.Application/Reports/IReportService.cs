using Seeagle.Application.Common;
using Seeagle.Domain.Reports;

namespace Seeagle.Application.Reports;

public interface IReportService
{
    Task<ReportDto> CreateAsync(Guid userId, CreateReportRequest request, CancellationToken cancellationToken);

    Task<PagedResult<ReportDto>> GetPendingAsync(int pageNumber, int pageSize, CancellationToken cancellationToken);

    Task<Report?> ApproveAsync(Guid id,string priority, CancellationToken cancellationToken);

    Task<Report?> RejectAsync(Guid id, string? message, CancellationToken cancellationToken);
    Task<Report?> MarkAsSolvedAsync(Guid id, string? message, CancellationToken cancellationToken);
    Task<PagedResult<ReportDto>> GetApprovedReportsAsync(int pageNumber, int pageSize, CancellationToken cancellationToken);
    Task<Report?> SendMessageToReporterAsync(Guid id, string? message, CancellationToken cancellationToken);
    Task<ReportDto?> AttachPhotoAsync(Guid reportId, Guid userId, byte[] data, string contentType, CancellationToken ct);
    Task<ProcessedPhoto?> GetPhotoAsync(Guid reportId, bool isModerator, CancellationToken ct);
    
    Task<PagedResult<ReportDto>> GetUserReportsAsync(Guid userId, int pageNumber, int pageSize, CancellationToken cancellationToken);
    Task<PagedResult<ReportDto>> GetByStatusAsync(string? status, string? excludeStatus, int pageNumber, int pageSize, CancellationToken cancellationToken);
    Task<bool>SoftDeleteAsync(Guid id, CancellationToken cancellationToken);
	Task<ReportDto?> UpdateAsync(Guid id, UpdateReportRequest request, CancellationToken cancellationToken);
}