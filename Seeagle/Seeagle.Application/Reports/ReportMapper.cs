using Seeagle.Application.Common;
using Seeagle.Domain.Reports;

namespace Seeagle.Application.Reports;

public static class ReportMapper
{
    extension(Report report)
    {
        public ReportDto Dto() => new(
            report.Id,
            report.Location.X,
            report.Location.Y,
            report.Description,
            report.CreatedUtc,
            report.Status.ToString(),
            report.Priority.ToString(),
            report.Type.Name,
            report.MessageToReporter,
            report.AiProbabilityScore
        );
    }

    extension(PagedResult<Report> reports)
    {
        public PagedResult<ReportDto> Dto()
        {
            var reportsDto = new List<ReportDto>();
            foreach (var reportsItem in reports.Items)
            {
                reportsDto.Add(reportsItem.Dto());
            }

            return new PagedResult<ReportDto>(
                reportsDto,
                reports.TotalCount,
                reports.PageNumber,
                reports.PageSize
            );
        }
    }
    
    extension(IReadOnlyList<Report> reports)
    {
        public IReadOnlyList<ReportDto> Dto()
        {
            var reportsDto = new List<ReportDto>();
            foreach (var reportsItem in reports)
            {
                reportsDto.Add(reportsItem.Dto());
            }

            return reportsDto;
        }
    }
}