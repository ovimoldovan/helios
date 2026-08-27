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
    private static readonly int StandardGpsFormat = 4326;
    private static readonly GeometryFactory GeometryFactory = NtsGeometryServices.Instance.CreateGeometryFactory(srid: StandardGpsFormat);
    private readonly IPhotoProcessor _photoProcessor;

    public ReportService(IRepository<Report> reportRepository, IRepository<User> userRepository, IPhotoProcessor photoProcessor)
    {
        _reportRepository = reportRepository;
        _userRepository = userRepository;
        _photoProcessor = photoProcessor;
    }

    public async Task<ReportDto> CreateAsync(Guid userId, CreateReportRequest request, CancellationToken cancellationToken)
    {
        var user = _userRepository.GetAllQueryable().FirstOrDefault(u => u.Id == userId);
        if (user == null)
            throw new InvalidOperationException("User not found");
        
        var point = GeometryFactory.CreatePoint(new Coordinate(request.Longitude, request.Latitude));
        var report = new Report(point, request.Description, user);

        await _reportRepository.AddAsync(report, cancellationToken);

        return new ReportDto(
            report.Id,
            report.Location.X,
            report.Location.Y,
            report.Description,
            report.CreatedUtc,
            report.Status,
            report.Priority.ToString());
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
                report.Priority.ToString()))
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
 
        if (!Enum.TryParse<Priority>(priority, ignoreCase: true, out var parsedPriority))
        {
            throw new ArgumentException($"Invalid priority value: '{priority}'. Expected Low, Medium, or Urgent.", nameof(priority));
        }
 
        report.Approve(parsedPriority);
 
        await _reportRepository.UpdateAsync(report, cancellationToken);
 
        return new ReportDto(
            report.Id,
            report.Location.X,
            report.Location.Y,
            report.Description,
            report.CreatedUtc,
            report.Status,
            report.Priority.ToString());
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
            report.Priority.ToString());
    }

    public async Task<ReportDto?> AttachPhotoAsync(Guid reportId, Guid userId, byte[] data, string contentType, CancellationToken cancellationToken)
    {
        var report = _reportRepository
            .GetAllQueryable()
            .FirstOrDefault(report => report.Id == reportId);
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
            report.Status,
            report.Priority.ToString());
    }

    public async Task<ProcessedPhoto?> GetPhotoAsync(Guid reportId, bool isModerator, CancellationToken cancellationToken)
    {
        var report = _reportRepository
            .GetAllQueryable()
            .FirstOrDefault(report => report.Id == reportId);
        
        if (report?.Photo is null)
            return null;

        if (report.Status != "Approved" && !isModerator)
            return null;
        
        return new ProcessedPhoto(report.Photo.ImageData, report.Photo.ContentType);
    }
}