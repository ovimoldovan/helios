using System.ComponentModel.DataAnnotations;

namespace Seeagle.Application.Reports;

public sealed record UpdateReportRequest(
    [MaxLength(255)]
    string? Description,
    string? Priority
);
