namespace Seeagle.Application.Reports;

public sealed record ReportDto(
    Guid Id,
    double Longitude,
    double Latitude,
    string? Description,
    DateTime CreatedUtc,
    string Status,
    string Priority
    );