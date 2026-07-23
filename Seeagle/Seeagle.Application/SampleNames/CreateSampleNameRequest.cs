using System.ComponentModel.DataAnnotations;

namespace Seeagle.Application.SampleNames;

public sealed class CreateSampleNameRequest
{
    public const int MaximumLength = 10;

    [Required]
    [MaxLength(MaximumLength)]
    public string Name { get; init; } = string.Empty;
}
