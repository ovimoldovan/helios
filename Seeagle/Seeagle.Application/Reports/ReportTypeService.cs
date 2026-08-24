using Seeagle.Application.Common;
using Seeagle.Domain.Reports;

namespace Seeagle.Application.Reports;

public sealed class ReportTypeService : IReportTypeService
{
    private readonly IRepository<ReportType> _reportTypeRepository;

    public ReportTypeService(IRepository<ReportType> reportTypeRepository)
    {
        _reportTypeRepository = reportTypeRepository;
    }

    public async Task<ReportTypeDto> CreateAsync(
        CreateReportTypeRequest request,
        CancellationToken cancellationToken)
    {
        var normalizedName = request.Name.Trim();

        var exists = _reportTypeRepository
            .GetAllQueryable()
            .Any(reportType =>
                reportType.Name.ToLower() == normalizedName.ToLower());

        if (exists)
            throw new InvalidOperationException(
                "A report type with this name already exists.");

        var reportType = new ReportType(normalizedName);

        await _reportTypeRepository.AddAsync(
            reportType,
            cancellationToken);

        return MapToDto(reportType);
    }

    public async Task<IReadOnlyList<ReportTypeDto>> GetAllAsync(
        CancellationToken cancellationToken)
    {
        var reportTypes = await _reportTypeRepository
            .GetAllAsync(cancellationToken);

        return reportTypes
            .Select(MapToDto)
            .ToList();
    }

    public async Task<ReportTypeDto?> UpdateAsync(
        Guid id,
        UpdateReportTypeRequest request,
        CancellationToken cancellationToken)
    {
        var reportType = _reportTypeRepository
            .GetAllQueryable()
            .FirstOrDefault(reportType => reportType.Id == id);

        if (reportType is null)
            return null;

        var normalizedName = request.Name.Trim();

        var duplicateExists = _reportTypeRepository
            .GetAllQueryable()
            .Any(existingReportType =>
                existingReportType.Id != id &&
                existingReportType.Name.ToLower() == normalizedName.ToLower());

        if (duplicateExists)
            throw new InvalidOperationException(
                "A report type with this name already exists.");

        reportType.Rename(normalizedName);

        await _reportTypeRepository.UpdateAsync(
            reportType,
            cancellationToken);

        return MapToDto(reportType);
    }

    public async Task<ReportTypeDto?> DisableAsync(
        Guid id,
        CancellationToken cancellationToken)
    {
        var reportType = _reportTypeRepository
            .GetAllQueryable()
            .FirstOrDefault(reportType => reportType.Id == id);

        if (reportType is null)
            return null;

        reportType.Disable();

        await _reportTypeRepository.UpdateAsync(
            reportType,
            cancellationToken);

        return MapToDto(reportType);
    }

    private static ReportTypeDto MapToDto(ReportType reportType)
    {
        return new ReportTypeDto(
            reportType.Id,
            reportType.Name,
            reportType.IsActive);
    }
}