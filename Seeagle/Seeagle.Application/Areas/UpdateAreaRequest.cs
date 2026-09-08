using System.ComponentModel.DataAnnotations;

namespace Seeagle.Application.Areas;

public sealed class UpdateAreaRequest
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;
    
    public double[][]? Coordinates { get; set; }
}