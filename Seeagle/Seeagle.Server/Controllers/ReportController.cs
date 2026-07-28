using Microsoft.AspNetCore.Mvc;
using Seeagle.Application.Reports;

namespace Seeagle.Server.Controllers;

[ApiController]
[Route("api/reports")]
public sealed class ReportsController(IReportService reportService) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult<ReportDto>> Create(
        [FromBody] CreateReportRequest request, 
        CancellationToken cancellationToken)
    {
        var result = await reportService.CreateAsync(request, cancellationToken);
        return Ok(result);
    }
}