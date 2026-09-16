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

    public async Task<IReadOnlyList<Report>> GetApprovedReportsAsync(
        DateTime fromDate,
        CancellationToken cancellationToken)
    {
        var reports = await _reportRepository.GetAllQueryable()
            .Include(report => report.Type)
            .Where(report => report.Status == ReportStatus.Approved && report.CreatedUtc >= fromDate && report.Status != ReportStatus.Solved)
            .OrderByDescending(report => report.CreatedUtc)
            .ToListAsync(cancellationToken);

        return reports;
    }
    
    public async Task<PagedResult<Report>> GetPublicReportsAsync(
        int pageNumber,
        int pageSize,
        string? status,
        Guid? areaId,
        string? sortBy,
        string? sortOrder,
        CancellationToken cancellationToken)
    {
        var query = _reportRepository.GetAllQueryable()
            .Include(report => report.Type)
            .Where(report => !report.IsDeleted)
            .Where(report => report.Status == ReportStatus.Approved || report.Status == ReportStatus.Solved);
        
        if (!string.IsNullOrEmpty(status))
        {
            if (Enum.TryParse<ReportStatus>(status, true, out var statusEnum))
            {
                query = query.Where(report => report.Status == statusEnum);
            }
        }

        if (areaId.HasValue)
        {
            query = query.Where(report => report.AreaId == areaId.Value);
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
            .ToListAsync(cancellationToken);

        return new PagedResult<Report>(reports, totalCount, pageNumber, pageSize);
    }

    public async Task<PagedResult<Report>> GetAllReportsAsync(
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

        query = query.Include(report => report.Type);

        var totalCount = await query.CountAsync(cancellationToken);

        var reports = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return new PagedResult<Report>(reports, totalCount, pageNumber, pageSize);
    }
}