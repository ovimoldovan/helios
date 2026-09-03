namespace Seeagle.Application.Reports;

public sealed record UpdateReportRequest(
    string? Description,
    string? Priority
);