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
            .Where(report => report.Status == ReportStatus.Approved && report.CreatedUtc >= fromDate && report.Status != ReportStatus.Solved)
            .OrderByDescending(report => report.CreatedUtc)
            .Select(report => new ReportDto(
                report.Id,
                report.Location.X,
                report.Location.Y,
                report.Description,
                report.CreatedUtc,
                report.Status.ToString(),
                report.Priority.ToString(),
                report.Type.Name))
            .ToListAsync(cancellationToken);

        return reports;
    }
    
    public async Task<PagedResult<ReportDto>> GetPublicReportsAsync(
        int pageNumber,
        int pageSize,
        string? status,
        Guid? areaId,
        string? sortBy,
        string? sortOrder,
        CancellationToken cancellationToken)
    {
        var query = _reportRepository.GetAllQueryable()
            .Where(r => r.Status == "Approved" || r.Status == "Solved" || r.Status == "Pending");

        if (!string.IsNullOrEmpty(status))
        {
            query = query.Where(r => r.Status == status);
        }

        if (areaId.HasValue)
        {
            query = query.Where(r => r.AreaId == areaId.Value);
        }

        query = (sortBy?.ToLower(), sortOrder?.ToLower()) switch
        {
            ("priority", "asc") => query.OrderBy(r => r.Priority),
            ("priority", "desc") => query.OrderByDescending(r => r.Priority),
            ("status", "asc") => query.OrderBy(r => r.Status),
            ("status", "desc") => query.OrderByDescending(r => r.Status),
            _ => sortOrder == "asc"
                ? query.OrderBy(r => r.CreatedUtc)
                : query.OrderByDescending(r => r.CreatedUtc)
        };

        var totalCount = await query.CountAsync(cancellationToken);

        var reports = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Select(r => new ReportDto(
                r.Id,
                r.Location.X,
                r.Location.Y,
                r.Description,
                r.CreatedUtc,
                r.Status,
                r.Priority.ToString()))
            .ToListAsync(cancellationToken);

        return new PagedResult<ReportDto>(reports, totalCount, pageNumber, pageSize);
    }

    public async Task<PagedResult<ReportDto>> GetAllReportsAsync(
        int pageNumber,
        int pageSize,
        string? sortBy,
        string? sortOrder,
        CancellationToken cancellationToken)
    {
        var query = _reportRepository.GetAllQueryable();
        query = sortBy?.ToLower() switch
        {
            "priority" => sortOrder == "asc"
                ? query.OrderBy(r => r.Priority)
                : query.OrderByDescending(r => r.Priority),
            "status" => sortOrder == "asc"
                ? query.OrderBy(r => r.Status)
                : query.OrderByDescending(r => r.Status),
            _ => sortOrder == "asc"
                ? query.OrderBy(r => r.CreatedUtc)
                : query.OrderByDescending(r => r.CreatedUtc)
        };

        var totalCount = await query.CountAsync(cancellationToken);

        var reports = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Select(report => new ReportDto(
                report.Id,
                report.Location.X,
                report.Location.Y,
                report.Description,
                report.CreatedUtc,
                report.Status.ToString(),
                report.Priority.ToString(),
                report.Type.Name))
            .ToListAsync(cancellationToken);

        return new PagedResult<ReportDto>(reports, totalCount, pageNumber, pageSize);
    }
}
