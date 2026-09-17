namespace Seeagle.Application.Reports;

public sealed record ReportDto(
    Guid Id,
    double Longitude,
    double Latitude,
    string? Description,
    DateTime CreatedUtc,
    string Status,
    string Priority,
    string Type,
    string? MessageToReporter,
    bool HasPhoto,
    bool IsPhotoVisibleToPublic
)
{
    public IReadOnlyList<Guid> DuplicateCandidateIds { get; init; } = [];
    public IReadOnlyList<DuplicateCandidateDto> DuplicateCandidates { get; init; } = [];
}

public sealed record DuplicateCandidateDto(
    Guid Id,
    double Longitude,
    double Latitude,
    string? Description,
    DateTime CreatedUtc,
    string Status,
    string Priority,
    string Type
);