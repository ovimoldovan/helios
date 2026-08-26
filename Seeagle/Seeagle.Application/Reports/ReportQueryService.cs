using Microsoft.EntityFrameworkCore;
using Seeagle.Application.Common;
using Seeagle.Domain.Reports;

namespace Seeagle.Application.Reports;

public sealed class ReportQueryService : IReportQueryService
{
    private readonly IRepository<Report> _reportRepository;

    public ReportQueryService(IRepository<Report> reportRepository)
    {
        _reportRepository = reportRepository;
    }

    public async Task<IReadOnlyList<ReportDto>> GetApprovedReportsAsync(
        DateTime fromDate,
        CancellationToken cancellationToken)
    {
        var reports = await _reportRepository.GetAllQueryable()
            .Where(r => r.Status == "Approved" && r.CreatedUtc >= fromDate && r.Status != "Solved")
            .OrderByDescending(r => r.CreatedUtc)
            .Select(r => new ReportDto(
                r.Id,
                r.Location.X,
                r.Location.Y,
                r.Description,
                r.CreatedUtc,
                r.Status))
            .ToListAsync(cancellationToken);

        return reports;
    }
}
