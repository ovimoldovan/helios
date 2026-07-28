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
}