namespace Seeagle.Application.Settings;

public sealed record SystemSettingsDto(
    Guid Id,
    double DuplicateDistanceMeters,
    double DuplicateTimeWindowHours,
    DateTime UpdatedUtc
);
