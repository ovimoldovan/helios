using NetTopologySuite.Geometries;

namespace Seeagle.Domain.Reports;

public class Report
{
    private Report()
    {
        Location = null!;
        User = null!;
    }

    public Report(Point location, string? description, User.User user)
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
        Status = "Pending";
    }

    public Guid Id { get; private set; }
    public Point Location { get; set; }
    public string? Description { get; private set; }
    public DateTime CreatedUtc { get; private set; }
    public User.User User { get; private set; }
    public Guid? ReportTypeId { get; private set; }
    public string Status { get; private set; } = string.Empty;
    public Priority Priority { get; private set; } = Priority.Low;
    public string? MessageToReporter { get; private set; }
    public bool IsSolved { get; private set; }
    
    public void MarkAsSolved(string? message)
    {
        IsSolved =  true;
        MessageToReporter = message;
        Status = "Solved";
    }
    
    public void UpdateMessageToReporter(string? message)
    {
        MessageToReporter = message;
    }
    
    public void Approve(Priority priority)
    {
        Status = "Approved";
        Priority = priority;
    }
    
    public void Reject()
    {
        Status = "Rejected";
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