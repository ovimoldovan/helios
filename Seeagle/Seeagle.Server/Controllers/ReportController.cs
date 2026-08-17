using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Seeagle.Application.Reports;
using Microsoft.AspNetCore.Authorization;

namespace Seeagle.Server.Controllers;

[ApiController]
[Route("api/reports")]
public sealed class ReportsController(IReportService reportService) : ControllerBase
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
    
    [Authorize(Roles = "Moderator")]
    [HttpGet("pending")]
    public async Task<ActionResult<IReadOnlyList<ReportDto>>> GetPending(
        CancellationToken cancellationToken)
    {
        var reports = await reportService.GetPendingAsync(cancellationToken);
        return Ok(reports);
    }
    
    [Authorize(Roles = "Moderator")]
    [HttpPut("{id:guid}/approve")]
    public async Task<ActionResult<ReportDto>> Approve(
        Guid id,
        CancellationToken cancellationToken)
    {
        var report = await reportService.ApproveAsync(id, cancellationToken);

        if (report is null)
        {
            return NotFound();
        }

        return Ok(report);
    }
    
    [Authorize(Roles = "Moderator")]
    [HttpPut("{id:guid}/reject")]
    public async Task<ActionResult<ReportDto>> Reject(
        Guid id,
        CancellationToken cancellationToken)
    {
        var report = await reportService.RejectAsync(id, cancellationToken);

        if (report is null)
        {
            return NotFound();
        }

        return Ok(report);
    }
}