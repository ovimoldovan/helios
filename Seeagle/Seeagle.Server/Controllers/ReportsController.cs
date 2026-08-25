using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Seeagle.Application.Reports;
using Seeagle.Application.Common;

namespace Seeagle.Server.Controllers;

[ApiController]
[Route("api/reports")]
public sealed class ReportsController(IReportService reportService, IReportQueryService reportQueryService)
    : ControllerBase
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
    public async Task<ActionResult<IReadOnlyList<ReportDto>>> GetApprovedReports(
        [FromQuery] int days = 30,
        CancellationToken cancellationToken = default)
    {
        var fromDate = DateTime.UtcNow.AddDays(-days);
        var reports = await reportQueryService.GetApprovedReportsAsync(fromDate, cancellationToken);
        return Ok(reports);
    }

    [Authorize(Roles = "Moderator")]
    [HttpGet("pending")]
    public async Task<ActionResult<PagedResult<ReportDto>>> GetPending(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10,
        CancellationToken cancellationToken = default)
    {
        var reports = await reportService.GetPendingAsync(
            pageNumber,
            pageSize,
            cancellationToken);

        return Ok(reports);
    }

    [Authorize(Roles = "Moderator")]
    [HttpPut("{id:guid}/approve")]
    public async Task<ActionResult<ReportDto>> Approve(
        Guid id,
        [FromQuery] string priority = "low",
        CancellationToken cancellationToken = default)
    {
        var report = await reportService.ApproveAsync(id, priority, cancellationToken);
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