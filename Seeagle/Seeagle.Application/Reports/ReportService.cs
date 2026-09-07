using NetTopologySuite;
using NetTopologySuite.Geometries;
using Seeagle.Application.Common;
using Seeagle.Domain.Reports;
using Seeagle.Domain.User;
using Microsoft.EntityFrameworkCore;

namespace Seeagle.Application.Reports;

public sealed class ReportService : IReportService
{
    private readonly IRepository<Report> _reportRepository;
    private readonly IRepository<User> _userRepository;
    private readonly IRepository<ReportType> _reportTypeRepository;
    private static readonly int StandardGpsFormat = 4326;
    private static readonly GeometryFactory GeometryFactory = NtsGeometryServices.Instance.CreateGeometryFactory(srid: StandardGpsFormat);
    private static readonly string[] ValidStatuses = { "Pending", "Approved", "Rejected", "Solved" };

    public ReportService(IRepository<Report> reportRepository, IRepository<User> userRepository, IRepository<ReportType> reportTypeRepository)
    {
        _reportRepository = reportRepository;
        _userRepository = userRepository;
        _reportTypeRepository = reportTypeRepository;
    }

    public async Task<ReportDto> CreateAsync(Guid userId, CreateReportRequest request, CancellationToken cancellationToken)
    {
        var user = _userRepository.GetAllQueryable().FirstOrDefault(u => u.Id == userId);
        if (user == null)
            throw new InvalidOperationException("User not found");

        var reportType = _reportTypeRepository.GetAllQueryable().FirstOrDefault(type => type.Id == request.ReportTypeId);
        if (reportType == null)
            throw new InvalidOperationException("Report type doesn't exist");
        

        var point = GeometryFactory.CreatePoint(new Coordinate(request.Longitude, request.Latitude));
        var report = new Report(point, request.Description, user, reportType);

        await _reportRepository.AddAsync(report, cancellationToken);

        return new ReportDto(
            report.Id,
            report.Location.X,
            report.Location.Y,
            report.Description,
            report.CreatedUtc,
            report.Status,
            report.Priority.ToString(),
            reportType.Name);
    }

    public async Task<PagedResult<ReportDto>> GetPendingAsync(
        int pageNumber,
        int pageSize,
        CancellationToken cancellationToken)
    {
        var query = _reportRepository
            .GetAllQueryable()
            .Where(report => report.Status == "Pending");

        var totalCount = await query.CountAsync(cancellationToken);

        var reports = await query
            .OrderBy(report => report.CreatedUtc)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Select(report => new ReportDto(
                report.Id,
                report.Location.X,
                report.Location.Y,
                report.Description,
                report.CreatedUtc,
                report.Status,
                report.Priority.ToString(),
                report.Type.Name))
            .ToListAsync(cancellationToken);

        return new PagedResult<ReportDto>(
            reports,
            totalCount,
            pageNumber,
            pageSize);
    }

    public async Task<ReportDto?> ApproveAsync(Guid id, string priority, CancellationToken cancellationToken)
    {
        var report = _reportRepository
            .GetAllQueryable()
            .FirstOrDefault(report => report.Id == id);

        if (report is null)
        {
            return null;
        }

        var priorityEnum = priority.ToLower() switch
        {
            "urgent" => Priority.Urgent,
            "medium" => Priority.Medium,
            _ => Priority.Low
        };

        report.Approve(priorityEnum);

        await _reportRepository.UpdateAsync(report, cancellationToken);

        return new ReportDto(
            report.Id,
            report.Location.X,
            report.Location.Y,
            report.Description,
            report.CreatedUtc,
            report.Status,
            report.Priority.ToString(),
            report.Type.Name);
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
            report.Location.X,
            report.Location.Y,
            report.Description,
            report.CreatedUtc,
            report.Status,
            report.Priority.ToString(),
            report.Type.Name);
    }

    public async Task<ReportDto?> MarkAsSolvedAsync(Guid id, string? message, CancellationToken cancellationToken)
    {
        var report = _reportRepository
            .GetAllQueryable()
            .FirstOrDefault(report => report.Id == id);
        if (report is null)
        {
            return null;
        }
        report.MarkAsSolved(message);
        await _reportRepository.UpdateAsync(report, cancellationToken);
        
        return new ReportDto(
            report.Id,
            report.Location.X,
            report.Location.Y,
            report.Description,
            report.CreatedUtc,
            report.Status,
            report.Priority.ToString(),
            report.Type.Name);
    }

    public async Task<PagedResult<ReportDto>> GetApprovedReportsAsync(int pageNumber, int pageSize, CancellationToken cancellationToken)
    {
        var query = _reportRepository
            .GetAllQueryable()
            .Where(report => report.Status == "Approved" && !report.IsSolved);

        var totalCount = await query.CountAsync(cancellationToken);

        var reports = await query
            .OrderByDescending(report => report.CreatedUtc)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Select(report => new ReportDto(
                report.Id,
                report.Location.X,
                report.Location.Y,
                report.Description,
                report.CreatedUtc,
                report.Status,
                report.Priority.ToString(),
                report.Type.Name))
            .ToListAsync(cancellationToken);

        return new PagedResult<ReportDto>(reports, totalCount, pageNumber, pageSize);
    }
    public async Task<ReportDto?> SendMessageToReporterAsync(Guid id, string? message, CancellationToken cancellationToken)
    {
        var report = await _reportRepository
            .GetAllQueryable()
            .FirstOrDefaultAsync(r => r.Id == id, cancellationToken);

        if (report is null)
        {
            return null;
        }

        report.UpdateMessageToReporter(message);

        await _reportRepository.UpdateAsync(report, cancellationToken);

        return new ReportDto(
            report.Id,
            report.Location.X,
            report.Location.Y,
            report.Description,
            report.CreatedUtc,
            report.Status,
            report.Priority.ToString(),
            report.Type.Name
        );
    }
    public async Task<PagedResult<ReportDto>> GetUserReportsAsync(
        Guid userId,
        int pageNumber,
        int pageSize,
        CancellationToken cancellationToken)
    {
        var query = _reportRepository
            .GetAllQueryable()
            .Where(report => report.User.Id == userId);

        var totalCount = await query.CountAsync(cancellationToken);

        var reports = await query
            .OrderByDescending(report => report.CreatedUtc)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Select(report => new ReportDto(
                report.Id,
                report.Location.X,
                report.Location.Y,
                report.Description,
                report.CreatedUtc,
                report.Status,
                report.Priority.ToString(),
                report.Type.Name))
            .ToListAsync(cancellationToken);

        return new PagedResult<ReportDto>(reports, totalCount, pageNumber, pageSize);
    }
    public async Task<PagedResult<ReportDto>> GetByStatusAsync(string? status, string? excludeStatus, int pageNumber, int pageSize, CancellationToken cancellationToken)
    {
        if (status != null && !ValidStatuses.Contains(status))
        {
            throw new ArgumentException($"Invalid status: {status}. Valid statuses are: {string.Join(", ", ValidStatuses)}");
        }

        if (excludeStatus != null && !ValidStatuses.Contains(excludeStatus))
        {
            throw new ArgumentException($"Invalid excludeStatus: {excludeStatus}. Valid statuses are: {string.Join(", ", ValidStatuses)}");
        }

        var query = _reportRepository
            .GetAllQueryable()
            .Where(report => !report.IsDeleted);

        if(!string.IsNullOrWhiteSpace(status))
        {
            query = query.Where(report => report.Status == status);
        }
        if(!string.IsNullOrWhiteSpace(excludeStatus))
        {
            query = query.Where(report => report.Status != excludeStatus);
        }
        
        var totalCount = await query.CountAsync(cancellationToken);

        var reports = await query
            .OrderByDescending(report => report.CreatedUtc)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Select(report => new ReportDto(
                report.Id,
                report.Location.X,
                report.Location.Y,
                report.Description,
                report.CreatedUtc,
                report.Status,
                report.Priority.ToString(),
                report.Type.Name))
            .ToListAsync(cancellationToken);

        return new PagedResult<ReportDto>(reports, totalCount, pageNumber, pageSize);
    }   

    public async Task<bool> SoftDeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var report = await _reportRepository
            .GetAllQueryable()
            .FirstOrDefaultAsync(r => r.Id == id, cancellationToken);

        if (report is null)
        {
            return false;
        }

        report.Delete();

        await _reportRepository.UpdateAsync(report, cancellationToken);

        return true;
    }
	public async Task<ReportDto?> UpdateAsync(Guid id, UpdateReportRequest request, CancellationToken cancellationToken)
    {
        var report = await _reportRepository
            .GetAllQueryable()
            .FirstOrDefaultAsync(r => r.Id == id, cancellationToken);
      
        if (report is null)
   		{
        	return null;
    	}
       if (request.Description is not null)
		{
    		report.UpdateDescription(string.IsNullOrEmpty(request.Description) ? null : request.Description);
		}
        
        if (request.Priority is not null)
        {
            var priorityEnum = request.Priority.ToLower() switch
            {
                "urgent" => Priority.Urgent,
                "medium" => Priority.Medium,
                _ => Priority.Low
            };
            report.UpdatePriority(priorityEnum);
        }
        
        await _reportRepository.UpdateAsync(report, cancellationToken);
        
        return new ReportDto(
            report.Id,
            report.Location.X,
            report.Location.Y,
            report.Description,
            report.CreatedUtc,
            report.Status,
            report.Priority.ToString(),
            report.Type.Name
        );
    }
  
}
