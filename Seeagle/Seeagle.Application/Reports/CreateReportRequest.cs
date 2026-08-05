using System.ComponentModel.DataAnnotations;

namespace Seeagle.Application.Reports;

public sealed class CreateReportRequest
{
    [Required]
    [Range(-180, 180)]
    public double Longitude { get; set; }

    [Required]
    [Range(-90, 90)]
    public double Latitude { get; set; }

    [MaxLength(255)]
    public string? Description { get; set; }
}