namespace Seeagle.Application.Reports;

public sealed record ReportDto(
    Guid Id,
    double Latitude,
    double Longitude,
    string? Description,
    DateTime CreatedUtc,
    string Status);