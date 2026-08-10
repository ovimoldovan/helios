using Microsoft.AspNetCore.Mvc;
using Seeagle.Application.Reports;
using Microsoft.AspNetCore.Authorization;

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