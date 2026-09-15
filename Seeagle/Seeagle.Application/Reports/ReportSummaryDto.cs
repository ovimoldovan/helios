namespace Seeagle.Application.Reports;

public sealed record ReportSummaryDto(
    IReadOnlyList<StatusCountDto> ByStatus,
    IReadOnlyList<TypeCountDto> ByType,
    IReadOnlyList<AreaCountDto> ByArea,
    int TotalCount
);

public sealed record StatusCountDto(string Status, int Count);
public sealed record TypeCountDto(string Type, int Count);
public sealed record AreaCountDto(Guid? AreaId, string AreaName, int Count);