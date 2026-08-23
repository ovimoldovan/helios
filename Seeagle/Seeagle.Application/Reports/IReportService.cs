using Seeagle.Application.Common;

namespace Seeagle.Application.Reports;

public interface IReportService
{
    Task<ReportDto> CreateAsync(Guid userId, CreateReportRequest request, CancellationToken cancellationToken);

    Task<PagedResult<ReportDto>> GetPendingAsync(int pageNumber, int pageSize, CancellationToken cancellationToken);

    Task<ReportDto?> ApproveAsync(Guid id, CancellationToken cancellationToken);

    Task<ReportDto?> RejectAsync(Guid id, CancellationToken cancellationToken);

    Task<ReportDto?> AttachPhotoAsync(Guid reportId, Guid userId, byte[] data, string contentType,
        CancellationToken ct);

    Task<ProcessedPhoto?> GetPhotoAsync(Guid reportId, CancellationToken ct);
    
}