namespace Seeagle.Application.Reports;

public interface IReportTypeService
{
    Task<ReportTypeDto> CreateAsync(CreateReportTypeRequest request, CancellationToken cancellationToken);

    Task<IReadOnlyList<ReportTypeDto>> GetAllAsync(CancellationToken cancellationToken);

    Task<ReportTypeDto?> UpdateAsync(Guid id, UpdateReportTypeRequest request, CancellationToken cancellationToken);

    Task<ReportTypeDto?> DisableAsync(Guid id, CancellationToken cancellationToken);
}