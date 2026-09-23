using Seeagle.Application.Common;
using Seeagle.Domain.Reports;

namespace Seeagle.Application.Reports;

public interface IReportService
{
    Task<Report> CreateAsync(Guid userId, CreateReportRequest request, CancellationToken cancellationToken);

    Task<PagedResult<Report>> GetPendingAsync(int pageNumber, int pageSize, CancellationToken cancellationToken);

    Task<Report?> ApproveAsync(Guid id, string priority, bool showPhotoToPublic, CancellationToken cancellationToken);

    Task<Report?> RejectAsync(Guid id, string? message, CancellationToken cancellationToken);
    Task<Report?> MarkAsSolvedAsync(Guid id, string? message, CancellationToken cancellationToken);
    Task<PagedResult<Report>> GetApprovedReportsAsync(int pageNumber, int pageSize, CancellationToken cancellationToken);
    Task<Report?> SendMessageToReporterAsync(Guid id, string message, CancellationToken cancellationToken);
    Task<Report?> AttachPhotoAsync(Guid reportId, Guid userId, byte[] data, string contentType, double? aiProbabilityScore, CancellationToken ct);
    Task<ProcessedPhoto?> GetPhotoAsync(Guid reportId, bool isModerator, CancellationToken ct);
    
    Task<PagedResult<Report>> GetUserReportsAsync(Guid userId, int pageNumber, int pageSize, CancellationToken cancellationToken);
    Task<PagedResult<Report>> GetByStatusAsync(string? status, string? excludeStatus, int pageNumber, int pageSize, CancellationToken cancellationToken);
    Task<bool>SoftDeleteAsync(Guid id, CancellationToken cancellationToken);
	Task<Report?> UpdateAsync(Guid id, UpdateReportRequest request, CancellationToken cancellationToken);
    Task <List<CsvReportDto>> GetByStatusForExportAsync(string? status, string? excludeStatus, CancellationToken cancellationToken);
    
}