namespace Seeagle.Application.Areas;

public sealed record AreaDto(
    Guid Id,
    string Name,
    double[][] Coordinates,
    DateTime CreatedUtc
);