using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Seeagle.Application.Reports;

namespace Seeagle.Server.Controllers;

[ApiController]
[Route("api/reports")]
public sealed class ReportsController(IReportService reportService, IReportQueryService reportQueryService) : ControllerBase
{
    [Authorize]
    [HttpPost]
    public async Task<ActionResult<ReportDto>> Create(
        [FromBody] CreateReportRequest request, 
        CancellationToken cancellationToken)
    {
        try
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(new { message = "User ID claim is missing or invalid." });
            }
            var result = await reportService.CreateAsync(userId, request, cancellationToken);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
    
    [HttpGet("approved")]
    public async Task<ActionResult<IReadOnlyList<ReportDto>>> GetApprovedReports( CancellationToken cancellationToken )
    {
        var reports = await reportQueryService.GetApprovedReportsAsync(cancellationToken);
        return Ok(reports);
    }
}