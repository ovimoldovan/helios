using System.ComponentModel.DataAnnotations;

namespace Seeagle.Application.Areas;

public sealed class CreateAreaRequest
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    public double[][] Coordinates { get; set; } = [];
}