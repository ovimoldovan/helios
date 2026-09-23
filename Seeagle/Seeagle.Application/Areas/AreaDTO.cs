namespace Seeagle.Application.Areas;

public sealed record AreaDto(
    Guid Id,
    string Name,
    string Slug,
    double[][] Coordinates,
    DateTime CreatedUtc
);