using Microsoft.EntityFrameworkCore;
using NetTopologySuite.Geometries;
using Seeagle.Application.Common;
using Seeagle.Domain.Reports;
using Seeagle.Domain.Areas;

namespace Seeagle.Application.Reports;

public sealed class ReportQueryService : IReportQueryService
{
    private readonly IRepository<Report> _reportRepository;
    private readonly IRepository<Area> _areaRepository;

    public ReportQueryService(
        IRepository<Report> reportRepository,
        IRepository<Area> areaRepository)
    {
        _reportRepository = reportRepository;
        _areaRepository = areaRepository;
    }

    public async Task<IReadOnlyList<ReportDto>> GetApprovedReportsAsync(
        DateTime fromDate,
        Guid? areaId,
        CancellationToken cancellationToken)
    {
        var query = _reportRepository.GetAllQueryable()
            .Where(report => report.Status == ReportStatus.Approved && report.CreatedUtc >= fromDate && report.Status != ReportStatus.Solved);

        if (areaId.HasValue)
        {
            var areaGeometry = await GetAreaGeometryAsync(areaId.Value, cancellationToken);
            
            if (areaGeometry is null)
                return Array.Empty<ReportDto>();

            query = ApplyAreaFilter(query, areaGeometry);
        }

        var reports = await query
            .OrderByDescending(report => report.CreatedUtc)
            .Select(report => new ReportDto(
                report.Id,
                report.Location.X,
                report.Location.Y,
                report.Description,
                report.CreatedUtc,
                report.Status.ToString(),
                report.Priority.ToString(),
                report.Type.Name,
                report.MessageToReporter))
            .ToListAsync(cancellationToken);

        return reports;
    }
    
    private async Task<Geometry?> GetAreaGeometryAsync(Guid areaId, CancellationToken cancellationToken)
    {
        return await _areaRepository.GetAllQueryable()
            .Where(a => a.Id == areaId)
            .Select(a => a.Geometry)
            .FirstOrDefaultAsync(cancellationToken);
    }
    
    private static IQueryable<Report> ApplyAreaFilter(IQueryable<Report> query, Geometry areaGeometry)
    {
        return query.Where(r => areaGeometry.Contains(r.Location));
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
            .Where(r => !r.IsDeleted)
            .Where(r => r.Status == ReportStatus.Approved || r.Status == ReportStatus.Solved);
        
        if (!string.IsNullOrEmpty(status))
        {
            if (Enum.TryParse<ReportStatus>(status, true, out var statusEnum))
            {
                query = query.Where(r => r.Status == statusEnum);
            }
        }

        if (areaId.HasValue)
        {
            var areaGeometry = await GetAreaGeometryAsync(areaId.Value, cancellationToken);
            if (areaGeometry is null)
                return new PagedResult<ReportDto>(Array.Empty<ReportDto>(), 0, pageNumber, pageSize);

            query = ApplyAreaFilter(query, areaGeometry);
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
                r.Status.ToString(),
                r.Priority.ToString(),
                r.Type.Name,
                r.MessageToReporter))
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
                report.Type.Name,
                report.MessageToReporter))
            .ToListAsync(cancellationToken);

        return new PagedResult<ReportDto>(reports, totalCount, pageNumber, pageSize);
    }


    public async Task<ReportSummaryDto> GetSummaryAsync(CancellationToken cancellationToken)
	{
    	var query = _reportRepository.GetAllQueryable()
        	.Where(r => !r.IsDeleted);

   	 	var totalCount = await query.CountAsync(cancellationToken);

    	var byStatus = await query
        	.GroupBy(r => r.Status)
        	.Select(g => new StatusCountDto(g.Key.ToString(), g.Count()))
        	.ToListAsync(cancellationToken);

    	var byType = await query
        	.GroupBy(r => r.Type.Name)
        	.Select(g => new TypeCountDto(g.Key, g.Count()))
        	.ToListAsync(cancellationToken);

    	var byAreaRaw = await query
        	.GroupBy(r => r.AreaId)
        	.Select(g => new { AreaId = g.Key, Count = g.Count() })
        	.ToListAsync(cancellationToken);

    	var areaIds = byAreaRaw
        	.Where(a => a.AreaId.HasValue)
        	.Select(a => a.AreaId!.Value)
        	.ToList();

    	var areaNames = await _areaRepository.GetAllQueryable()
        	.Where(a => areaIds.Contains(a.Id))
        	.ToDictionaryAsync(a => a.Id, a => a.Name, cancellationToken);

    	var byArea = byAreaRaw
        	.Select(a => new AreaCountDto(
            	a.AreaId,
            	a.AreaId.HasValue && areaNames.TryGetValue(a.AreaId.Value, out var name) ? name : null,
            	a.Count))
        	.ToList();

    	return new ReportSummaryDto(byStatus, byType, byArea, totalCount);
	}

}