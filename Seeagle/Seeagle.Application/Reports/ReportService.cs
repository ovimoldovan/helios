using NetTopologySuite;
using NetTopologySuite.Geometries;
using Seeagle.Application.Common;
using Seeagle.Domain.Reports;
using Seeagle.Domain.User;
using Microsoft.EntityFrameworkCore;
using Seeagle.Domain.Areas;

namespace Seeagle.Application.Reports;

public sealed class ReportService : IReportService
{
    private readonly IRepository<Report> _reportRepository;
    private readonly IRepository<User> _userRepository;
    private readonly IRepository<ReportType> _reportTypeRepository;
    private readonly IRepository<Area> _areaRepository;
    private readonly IRepository<Photo> _photoRepository;
    
    private static readonly int StandardGpsFormat = 4326;
    private static readonly GeometryFactory GeometryFactory = NtsGeometryServices.Instance.CreateGeometryFactory(srid: StandardGpsFormat);
    private readonly IPhotoProcessor _photoProcessor;
    private static readonly string[] ValidStatuses = { "Pending", "Approved", "Rejected", "Solved" };

    public ReportService(
        IRepository<Report> reportRepository,
        IRepository<User> userRepository,
        IRepository<Area> areaRepository,
        IRepository<ReportType> reportTypeRepository,
        IRepository<Photo> photoRepository,
        IPhotoProcessor photoProcessor)
    {
        _reportRepository = reportRepository;
        _userRepository = userRepository;
        _areaRepository = areaRepository;
        _reportTypeRepository = reportTypeRepository;
        _photoRepository = photoRepository;
        _photoProcessor = photoProcessor;
    }

    private static string GetTypeName(Report report)
    {
        return report.Type?.Name ?? "General";
    }

    public async Task<ReportDto> CreateAsync(Guid userId, CreateReportRequest request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetAllQueryable()
            .FirstOrDefaultAsync(u => u.Id == userId, cancellationToken);
        if (user == null)
            throw new InvalidOperationException("User not found");

        var reportType = await _reportTypeRepository.GetAllQueryable()
            .FirstOrDefaultAsync(type => type.Id == request.ReportTypeId, cancellationToken);
        if (reportType == null)
            throw new InvalidOperationException("Report type doesn't exist");

        var point = GeometryFactory.CreatePoint(new Coordinate(request.Longitude, request.Latitude));
        var report = new Report(point, request.Description, user, reportType);

        var area = await _areaRepository.GetAllQueryable()
            .FirstOrDefaultAsync(
                a => !a.IsDeleted && a.Geometry.Contains(point),
                cancellationToken);
        
        if (area != null)
        {
            report.SetAreaId(area.Id);
        }

        await _reportRepository.AddAsync(report, cancellationToken);

        return new ReportDto(
            report.Id,
            report.Location.X,
            report.Location.Y,
            report.Description,
            report.CreatedUtc,
            report.Status.ToString(),
            report.Priority.ToString(),
            GetTypeName(report),
            report.MessageToReporter, 
            report.Photo != null,
            report.Photo?.IsVisibleToPublic ?? false);
    }

    public async Task<PagedResult<ReportDto>> GetPendingAsync(
        int pageNumber,
        int pageSize,
        CancellationToken cancellationToken)
    {
        var query = _reportRepository
            .GetAllQueryable()
            .Where(report => report.Status == ReportStatus.Pending);

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
                report.Status.ToString(),
                report.Priority.ToString(),
                report.Type.Name,
                report.MessageToReporter,
                report.Photo != null,
                report.Photo != null && report.Photo.IsVisibleToPublic))
            .ToListAsync(cancellationToken);

        return new PagedResult<ReportDto>(
            reports,
            totalCount,
            pageNumber,
            pageSize);
    }

    public async Task<ReportDto?> ApproveAsync(Guid id, string priority, CancellationToken cancellationToken)
    {
        var report = await _reportRepository
            .GetAllQueryable()
            .Include(report => report.Type)
            .FirstOrDefaultAsync(report => report.Id == id, cancellationToken);

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
            report.Status.ToString(),
            report.Priority.ToString(),
            GetTypeName(report),
            report.MessageToReporter,
        report.Photo != null,
        report.Photo?.IsVisibleToPublic ?? false);;
    }

    public async Task<ReportDto?> RejectAsync(Guid id, string? message, CancellationToken cancellationToken)
    {
        var report = await _reportRepository
            .GetAllQueryable()
            .Include(report => report.Type)
            .FirstOrDefaultAsync(report => report.Id == id);

    	if (report is null)
    	{
        	return null;
    	}

    	report.Reject();
    	report.UpdateMessageToReporter(message);

        await _reportRepository.UpdateAsync(report, cancellationToken);

    	return new ReportDto(
        	report.Id,
        	report.Location.X,
        	report.Location.Y,
        	report.Description,
        	report.CreatedUtc,
        	report.Status.ToString(),
        	report.Priority.ToString(),
        	GetTypeName(report),
        	report.MessageToReporter,
            report.Photo != null,
            report.Photo?.IsVisibleToPublic ?? false);
	}
    public async Task<ReportDto?> MarkAsSolvedAsync(Guid id, string? message, CancellationToken cancellationToken)
    {
        var report = await _reportRepository
            .GetAllQueryable()
            .Include(report => report.Type)
            .FirstOrDefaultAsync(report => report.Id == id);
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
            report.Status.ToString(),
            report.Priority.ToString(),
            GetTypeName(report),
            report.MessageToReporter,
            report.Photo != null,
            report.Photo?.IsVisibleToPublic ?? false);
    }

    public async Task<PagedResult<ReportDto>> GetApprovedReportsAsync(int pageNumber, int pageSize, CancellationToken cancellationToken)
    {
        var query = _reportRepository
            .GetAllQueryable()
            .Where(report => report.Status == ReportStatus.Approved && !report.IsSolved);

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
                report.Status.ToString(),
                report.Priority.ToString(),
                report.Type.Name,
                report.MessageToReporter,
                report.Photo != null,
                report.Photo != null && report.Photo.IsVisibleToPublic))
            .ToListAsync(cancellationToken);

        return new PagedResult<ReportDto>(reports, totalCount, pageNumber, pageSize);
    }

    public async Task<ReportDto?> SendMessageToReporterAsync(Guid id, string? message, CancellationToken cancellationToken)
    {
        var report = await _reportRepository
            .GetAllQueryable()
            .Include(report => report.Type)
            .FirstOrDefaultAsync(report => report.Id == id, cancellationToken);

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
            report.Status.ToString(),
            report.Priority.ToString(),
            GetTypeName(report),
            report.MessageToReporter,
            report.Photo != null,
            report.Photo?.IsVisibleToPublic ?? false);
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
                report.Status.ToString(),
                report.Priority.ToString(),
                report.Type.Name,
                report.MessageToReporter,
                report.Photo != null,
                report.Photo != null && report.Photo.IsVisibleToPublic))
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

        if (!string.IsNullOrWhiteSpace(status))
        {
            var statusEnum = Enum.Parse<ReportStatus>(status);
            query = query.Where(report => report.Status == statusEnum);
        }
        if (!string.IsNullOrWhiteSpace(excludeStatus))
        {
            var excludeEnum = Enum.Parse<ReportStatus>(excludeStatus);
            query = query.Where(report => report.Status != excludeEnum);
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
                report.Status.ToString(),
                report.Priority.ToString(),
                report.Type.Name,
                report.MessageToReporter,
                report.Photo != null,
                report.Photo != null && report.Photo.IsVisibleToPublic))
            .ToListAsync(cancellationToken);

        return new PagedResult<ReportDto>(reports, totalCount, pageNumber, pageSize);
    }

    public async Task<bool> SoftDeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var report = await _reportRepository
            .GetAllQueryable()
            .FirstOrDefaultAsync(report => report.Id == id, cancellationToken);

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
            .Include(report => report.Type)
            .FirstOrDefaultAsync(report => report.Id == id, cancellationToken);
        
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
            report.Status.ToString(),
            report.Priority.ToString(),
            GetTypeName(report),
            report.MessageToReporter,
            report.Photo != null,
            report.Photo?.IsVisibleToPublic ?? false);
    }

    public async Task<ReportDto?> AttachPhotoAsync(Guid reportId, Guid userId, byte[] data, string contentType, CancellationToken cancellationToken)
    {
        var report = await _reportRepository
            .GetAllQueryable()
            .Include(report => report.Type)
            .Include(report => report.User)
            .FirstOrDefaultAsync(report => report.Id == reportId, cancellationToken);
        
        if (report is null)
            return null;
        if (report.User.Id != userId)
            throw new UnauthorizedAccessException("You can only attach a photo to your own report.");

        var processed = await _photoProcessor.ProcessAsync(new MemoryStream(data), cancellationToken);
        var photo = new Photo(processed.Data, processed.ContentType, report);
        report.AttachPhoto(photo);

        await _photoRepository.AddAsync(photo, cancellationToken);

        return new ReportDto(
            report.Id,
            report.Location.X,
            report.Location.Y,
            report.Description,
            report.CreatedUtc,
            report.Status.ToString(),
            report.Priority.ToString(),
            GetTypeName(report),
            report.MessageToReporter,
            report.Photo != null,
            report.Photo?.IsVisibleToPublic ?? false);
    }

    public async Task<ProcessedPhoto?> GetPhotoAsync(Guid reportId, bool isModerator, Guid? requestingUserId, CancellationToken cancellationToken)
    {
        var report = await _reportRepository
            .GetAllQueryable()
            .FirstOrDefaultAsync(report => report.Id == reportId, cancellationToken);

        if (report?.Photo is null)
            return null;

        var isOwner = requestingUserId.HasValue && report.User.Id == requestingUserId.Value;

        if ((report.Status != ReportStatus.Approved || !report.Photo.IsVisibleToPublic) && !isModerator && !isOwner)
            return null;

        return new ProcessedPhoto(report.Photo.ImageData, report.Photo.ContentType);
    }

    public async Task<ReportDto?> SetPhotoVisibilityAsync(Guid reportId, bool isVisibleToPublic,
        CancellationToken cancellationToken)
    {
        var report = await _reportRepository
            .GetAllQueryable()
            .Include(report => report.Type)
            .FirstOrDefaultAsync(report => report.Id == reportId, cancellationToken);

        if (report?.Photo is null)
        {
            return null;
        }
        
        report.Photo.SetPublicVisibility(isVisibleToPublic);
        
        await _reportRepository.UpdateAsync(report, cancellationToken);
        
        return new ReportDto(
            report.Id,
            report.Location.X,
            report.Location.Y,
            report.Description,
            report.CreatedUtc,
            report.Status.ToString(),
            report.Priority.ToString(),
            GetTypeName(report),
            report.MessageToReporter,
            report.Photo != null,
            report.Photo?.IsVisibleToPublic ?? false);
    }
        public async Task<List<CsvReportDto>> GetByStatusForExportAsync(string? status, string? excludeStatus, CancellationToken cancellationToken)
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

        if (!string.IsNullOrWhiteSpace(status))
        {
            var statusEnum = Enum.Parse<ReportStatus>(status);
            query = query.Where(report => report.Status == statusEnum);
        }
        if (!string.IsNullOrWhiteSpace(excludeStatus))
        {
            var excludeEnum = Enum.Parse<ReportStatus>(excludeStatus);
            query = query.Where(report => report.Status != excludeEnum);
        }

        var reports = await query
            .OrderByDescending(report => report.CreatedUtc)
            .Select(report => new
            {
                report.Id,
                report.Description,
                Status = report.Status.ToString(),
                Priority = report.Priority.ToString(),
                Type = report.Type.Name,
                report.CreatedUtc,
                report.AreaId
            })
            .ToListAsync(cancellationToken);

        var areaIds = reports
            .Where(r => r.AreaId != null)
            .Select(r => r.AreaId!.Value)
            .Distinct()
            .ToList();

        var areas = await _areaRepository
            .GetAllQueryable()
            .Where(a => areaIds.Contains(a.Id))
            .ToDictionaryAsync(a => a.Id, a => a.Name, cancellationToken);

        return reports.Select(r => new CsvReportDto(
            r.Id,
            r.Description,
            r.Status,
            r.Priority,
            r.Type,
            r.CreatedUtc,
            r.AreaId != null && areas.TryGetValue(r.AreaId.Value, out var name) ? name : null
        )).ToList();
    }
}