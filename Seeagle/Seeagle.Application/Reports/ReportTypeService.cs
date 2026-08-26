using Seeagle.Application.Common;
using Seeagle.Domain.Reports;

namespace Seeagle.Application.Reports;

public sealed class ReportTypeService : IReportTypeService
{
    private readonly IRepository<ReportType> _reportTypeRepository;

    public ReportTypeService(IRepository<ReportType> reportTypeRepository)
    {
        _reportTypeRepository = reportTypeRepository;
    }

    public async Task<ReportTypeDto> CreateAsync(
        CreateReportTypeRequest request,
        CancellationToken cancellationToken)
    {
        var normalizedName = request.Name.Trim();

        var exists = _reportTypeRepository
            .GetAllQueryable()
            .Any(reportType => reportType.Name.ToLower() == normalizedName.ToLower());

        if (exists)
            throw new InvalidOperationException("A report type with this name already exists.");
        
        var reportType = new ReportType(normalizedName);

        await _reportTypeRepository.AddAsync(reportType, cancellationToken);
        
        return new ReportTypeDto(reportType.Id, reportType.Name);
    }
}