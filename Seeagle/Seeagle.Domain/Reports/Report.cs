namespace Seeagle.Domain.Reports;

public class Report
{
    private Report()
    {
    }

    public Report(double latitude, double longitude, string? description)
    {
        if (latitude < -90 || latitude > 90)
            throw new ArgumentOutOfRangeException(nameof(latitude), "Latitude must be between -90 and 90.");

        if (longitude < -180 || longitude > 180)
            throw new ArgumentOutOfRangeException(nameof(longitude), "Longitude must be between -180 and 180.");

        Id = Guid.NewGuid();
        Latitude = latitude;
        Longitude = longitude;
        Description = description;
        CreatedUtc = DateTime.UtcNow;
        Status = "Pending";
    }

    public Guid Id { get; private set; }
    public double Latitude { get; private set; }
    public double Longitude { get; private set; }
    public string? Description { get; private set; }
    public DateTime CreatedUtc { get; private set; }

    // Placeholder fields — no FK constraints for now.
    public Guid? UserId { get; private set; }
    public Guid? ReportTypeId { get; private set; }
    public string Status { get; private set; } =string.Empty;
}