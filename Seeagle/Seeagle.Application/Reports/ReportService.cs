using Seeagle.Application.Common;
using Seeagle.Domain.Reports;

namespace Seeagle.Application.Reports;

public sealed class ReportService : IReportService
{
    private readonly IRepository<Report> _reportRepository;

    public ReportService(IRepository<Report> reportRepository)
    {
        _reportRepository = reportRepository;
    }

    public async Task<ReportDto> CreateAsync(CreateReportRequest request, CancellationToken cancellationToken)
    {
        var report = new Report(request.Latitude, request.Longitude, request.Description);

        await _reportRepository.AddAsync(report, cancellationToken);

        return new ReportDto(
            report.Id,
            report.Latitude,
            report.Longitude,
            report.Description,
            report.CreatedUtc,
            report.Status);
    }
    
    public async Task<IReadOnlyList<ReportDto>> GetPendingAsync(CancellationToken cancellationToken)
    {
        var reports = await _reportRepository.GetAllAsync(cancellationToken);

        return reports
            .Where(report => report.Status == "Pending")
            .Select(report => new ReportDto(
                report.Id,
                report.Latitude,
                report.Longitude,
                report.Description,
                report.CreatedUtc,
                report.Status))
            .ToList();
    }
    
    public async Task<ReportDto?> ApproveAsync(Guid id, CancellationToken cancellationToken)
    {
        var report = _reportRepository
            .GetAllQueryable()
            .FirstOrDefault(report => report.Id == id);

        if (report is null)
        {
            return null;
        }

        report.Approve();

        await _reportRepository.UpdateAsync(report, cancellationToken);

        return new ReportDto(
            report.Id,
            report.Latitude,
            report.Longitude,
            report.Description,
            report.CreatedUtc,
            report.Status);
    }
    
    public async Task<ReportDto?> RejectAsync(Guid id, CancellationToken cancellationToken)
    {
        var report = _reportRepository
            .GetAllQueryable()
            .FirstOrDefault(report => report.Id == id);

        if (report is null)
        {
            return null;
        }

        report.Reject();

        await _reportRepository.UpdateAsync(report, cancellationToken);

        return new ReportDto(
            report.Id,
            report.Latitude,
            report.Longitude,
            report.Description,
            report.CreatedUtc,
            report.Status);
    }
}