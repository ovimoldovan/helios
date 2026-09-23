namespace Seeagle.Application.Settings;

public sealed record UpdateSystemSettingsRequest(
    double DuplicateDistanceMeters,
    double DuplicateTimeWindowHours
);