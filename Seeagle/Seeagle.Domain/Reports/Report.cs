using NetTopologySuite.Geometries;

namespace Seeagle.Domain.Reports;

public class Report
{
    private Report()
    {
        Location = null!;
        User = null!;
    }

    public Report(Point location, string? description, User.User user, ReportType type)
    {
        if (location.Y < -90 || location.Y > 90)
            throw new ArgumentOutOfRangeException(nameof(location.Y), "Latitude must be between -90 and 90.");

        if (location.X < -180 || location.X > 180)
            throw new ArgumentOutOfRangeException(nameof(location.X), "Longitude must be between -180 and 180.");

        Id = Guid.NewGuid();
        Location = location;
        Description = description;
        CreatedUtc = DateTime.UtcNow;
        User = user;
        Type = type;
    }

    public Guid Id { get; private set; }
    public Point Location { get; set; }
    public string? Description { get; private set; }
    public DateTime CreatedUtc { get; private set; }
    public Photo? Photo { get; private set; }
    public User.User User { get; private set; }
    public ReportType Type { get; private set; }
    public ReportStatus Status { get; private set; } = ReportStatus.Pending;
    public Priority Priority { get; private set; } = Priority.Low;
    public string? MessageToReporter { get; private set; }
    public bool IsSolved { get; private set; }
    
	public Guid? AreaId { get; private set; }
	public void SetAreaId(Guid? areaId)
    {
        AreaId = areaId;
    }
    public void MarkAsSolved(string? message)
    {
        IsSolved =  true;
        MessageToReporter = message;
        Status = ReportStatus.Solved;
    }
    
    public void UpdateMessageToReporter(string? message)
    {
        MessageToReporter = message;
    }
    
    public void Approve(Priority priority)
    {
        Status = ReportStatus.Approved;
        Priority = priority;
    }
    
    public void Reject()
    {
        Status = ReportStatus.Rejected;
    }
    
    public void AttachPhoto(Photo photo)
    {
        if (Photo is not null)
            throw new InvalidOperationException("Photo already attached to report.");
        Photo = photo;
    }

    public bool IsDeleted { get; private set; }

    public void Delete()
    {
        IsDeleted = true;
    }
    public void UpdateDescription(string description)
    {
        Description = description;
    }
    
    public void UpdatePriority(Priority priority)
    {
        Priority = priority;
    }
}