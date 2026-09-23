namespace Seeagle.Domain.Settings;

public class SystemSettings
{
    public const double MaxDistanceMeters = 1000;
    public static readonly TimeSpan MaxTimeWindow = TimeSpan.FromDays(365);

    private SystemSettings() { }

    public SystemSettings(double duplicateDistanceMeters, TimeSpan duplicateTimeWindow)
    {
        Id = Guid.NewGuid();
        SetThresholds(duplicateDistanceMeters, duplicateTimeWindow);
    }

    public Guid Id { get; private set; }
    public double DuplicateDistanceMeters { get; private set; }
    public TimeSpan DuplicateTimeWindow { get; private set; }
    public DateTime UpdatedUtc { get; private set; }

    public void SetThresholds(double duplicateDistanceMeters, TimeSpan duplicateTimeWindow)
    {
        if (duplicateDistanceMeters <= 0 || duplicateDistanceMeters > MaxDistanceMeters)
            throw new ArgumentOutOfRangeException(
                nameof(duplicateDistanceMeters),
                $"Distance must be between 0 and {MaxDistanceMeters} meters.");

        if (duplicateTimeWindow <= TimeSpan.Zero || duplicateTimeWindow > MaxTimeWindow)
            throw new ArgumentOutOfRangeException(
                nameof(duplicateTimeWindow),
                $"Time window must be between 0 and {MaxTimeWindow.TotalDays} days.");

        DuplicateDistanceMeters = duplicateDistanceMeters;
        DuplicateTimeWindow = duplicateTimeWindow;
        UpdatedUtc = DateTime.UtcNow;
    }
}