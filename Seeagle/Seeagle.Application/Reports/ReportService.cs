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
    
    private static readonly int StandardGpsFormat = 4326;
    private static readonly GeometryFactory GeometryFactory = NtsGeometryServices.Instance.CreateGeometryFactory(srid: StandardGpsFormat);
    private readonly IPhotoProcessor _photoProcessor;
    private static readonly string[] ValidStatuses = { "Pending", "Approved", "Rejected", "Solved" };

    public ReportService(
        IRepository<Report> reportRepository,
        IRepository<User> userRepository,
        IRepository<Area> areaRepository,
        IRepository<ReportType> reportTypeRepository,
        IPhotoProcessor photoProcessor)
    {
        _reportRepository = reportRepository;
        _userRepository = userRepository;
        _areaRepository = areaRepository;
        _reportTypeRepository = reportTypeRepository;
        _photoProcessor = photoProcessor;
    }

    private static string GetTypeName(Report report)
    {
        return report.Type?.Name ?? "General";
    }
    
    private static double CalculateDistanceInMeters(
        double latitude1,
        double longitude1,
        double latitude2,
        double longitude2)
    {
        const double earthRadiusMeters = 6371000;

        var latitudeDifference = DegreesToRadians(latitude2 - latitude1);
        var longitudeDifference = DegreesToRadians(longitude2 - longitude1);

        var a =
            Math.Sin(latitudeDifference / 2) * Math.Sin(latitudeDifference / 2) +
            Math.Cos(DegreesToRadians(latitude1)) *
            Math.Cos(DegreesToRadians(latitude2)) *
            Math.Sin(longitudeDifference / 2) *
            Math.Sin(longitudeDifference / 2);

        var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));

        return earthRadiusMeters * c;
    }

    private static double DegreesToRadians(double degrees)
    {
        return degrees * Math.PI / 180;
    }

    private static bool HasSimilarDescription(string? firstDescription, string? secondDescription)
    {
        if (string.IsNullOrWhiteSpace(firstDescription) ||
            string.IsNullOrWhiteSpace(secondDescription))
        {
            return false;
        }

        var firstWords = firstDescription
            .ToLowerInvariant()
            .Split(' ', StringSplitOptions.RemoveEmptyEntries)
            .Select(word => word.Trim('.', ',', '!', '?', ';', ':'))
            .Where(word => word.Length > 2)
            .ToHashSet();

        var secondWords = secondDescription
            .ToLowerInvariant()
            .Split(' ', StringSplitOptions.RemoveEmptyEntries)
            .Select(word => word.Trim('.', ',', '!', '?', ';', ':'))
            .Where(word => word.Length > 2)
            .ToHashSet();

        return firstWords.Intersect(secondWords).Count() >= 3;
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
        
        var duplicateCandidateStartDate = DateTime.UtcNow.AddHours(-72);

        var duplicateCandidates = await _reportRepository
            .GetAllQueryable()
            .Where(r =>
                !r.IsDeleted &&
                r.Type.Id == reportType.Id &&
                r.CreatedUtc >= duplicateCandidateStartDate)
            .ToListAsync(cancellationToken);

        var possibleDuplicates = duplicateCandidates
            .Where(candidate =>
                CalculateDistanceInMeters(
                    report.Location.Y,
                    report.Location.X,
                    candidate.Location.Y,
                    candidate.Location.X) <= 50)
            .Where(candidate =>
                HasSimilarDescription(report.Description, candidate.Description))
            .ToList();

        foreach (var duplicateCandidate in possibleDuplicates)
        {
            report.AddDuplicateCandidate(duplicateCandidate);
        }
        
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
            report.MessageToReporter);
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
                report.MessageToReporter)
            {
                DuplicateCandidateIds = report.DuplicateCandidates
                    .Select(candidate => candidate.Id)
                    .ToList(),

                DuplicateCandidates = report.DuplicateCandidates
                    .Select(candidate => new DuplicateCandidateDto(
                        candidate.Id,
                        candidate.Location.X,
                        candidate.Location.Y,
                        candidate.Description,
                        candidate.CreatedUtc,
                        candidate.Status.ToString(),
                        candidate.Priority.ToString(),
                        candidate.Type.Name
                    ))
                    .ToList()
            })
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
            report.MessageToReporter);
    }
	public async Task<ReportDto?> RejectAsync(Guid id, string? message, CancellationToken cancellationToken)
	{
    	var report = await _reportRepository
        	.GetAllQueryable()
        	.FirstOrDefaultAsync(report => report.Id == id, cancellationToken);

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
        	report.MessageToReporter);
	}
    public async Task<ReportDto?> MarkAsSolvedAsync(Guid id, string? message, CancellationToken cancellationToken)
    {
        var report = await _reportRepository
            .GetAllQueryable()
            .FirstOrDefaultAsync(report => report.Id == id, cancellationToken);
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
            report.MessageToReporter);
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
                report.MessageToReporter))
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
            report.Status.ToString(),
            report.Priority.ToString(),
            GetTypeName(report),
            report.MessageToReporter);
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
                report.MessageToReporter))
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
                report.MessageToReporter))
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
            report.Status.ToString(),
            report.Priority.ToString(),
            GetTypeName(report),
            report.MessageToReporter);
    }

    public async Task<ReportDto?> AttachPhotoAsync(Guid reportId, Guid userId, byte[] data, string contentType, CancellationToken cancellationToken)
    {
        var report = await _reportRepository
            .GetAllQueryable()
            .FirstOrDefaultAsync(report => report.Id == reportId, cancellationToken);
        if (report is null)
            return null;
        if (report.User.Id != userId)
            throw new UnauthorizedAccessException("You can only attach a photo to your own report.");

        var processed = await _photoProcessor.ProcessAsync(new MemoryStream(data), cancellationToken);
        var photo = new Photo(processed.Data, processed.ContentType, report);
        report.AttachPhoto(photo);

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
            report.MessageToReporter);
    }

    public async Task<ProcessedPhoto?> GetPhotoAsync(Guid reportId, bool isModerator, CancellationToken cancellationToken)
    {
        var report = await _reportRepository
            .GetAllQueryable()
            .FirstOrDefaultAsync(report => report.Id == reportId, cancellationToken);

        if (report?.Photo is null)
            return null;

        if (report.Status != ReportStatus.Approved && !isModerator)
            return null;

        return new ProcessedPhoto(report.Photo.ImageData, report.Photo.ContentType);
    }
}