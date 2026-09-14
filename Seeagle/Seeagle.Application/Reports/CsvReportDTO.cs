namespace Seeagle.Application.Reports;

public sealed record CsvReportDto(
    Guid Id,
    string? Description,
    string Status,
    string Priority,
    string Type,
    DateTime CreatedUtc,
    string? AreaName);