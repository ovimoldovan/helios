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
        
        // Returns HTTP 201 Created. 
        // The first two arguments are for the Location header (which we leave empty/null for now)
        // The last argument is the body of the response (our ReportDto)
        return CreatedAtAction(nameof(Create), null, result);
    }
}