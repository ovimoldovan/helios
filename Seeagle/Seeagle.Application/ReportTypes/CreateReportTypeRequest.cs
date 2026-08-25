using System.ComponentModel.DataAnnotations;

namespace Seeagle.Application.ReportTypes;

public sealed class CreateReportTypeRequest
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;
}