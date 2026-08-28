using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Seeagle.Application.Reports;

namespace Seeagle.Server.Controllers;

[ApiController]
[Route("api/report-types")]
public sealed class ReportTypesController(IReportTypeService reportTypeService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<ReportTypeDto>>> GetAll(CancellationToken cancellationToken)
    {
        var reportTypes = await reportTypeService.GetAllAsync(cancellationToken);
        return Ok(reportTypes);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ReportTypeDto>> Create(
        CreateReportTypeRequest request,
        CancellationToken cancellationToken)
    {
        try
        {
            var created = await reportTypeService.CreateAsync(request, cancellationToken);

            return Created($"/api/report-types/{created.Id}", created);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ReportTypeDto>> Update(Guid id, UpdateReportTypeRequest request, CancellationToken cancellationToken)
    {
        try
        {
            var updated = await reportTypeService.UpdateAsync(id, request, cancellationToken);

            if (updated is null)
                return NotFound();

            return Ok(updated);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpPut("{id:guid}/disable")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ReportTypeDto>> Disable(Guid id, CancellationToken cancellationToken)
    {
        var disabled = await reportTypeService.DisableAsync(id, cancellationToken);

        if (disabled is null)
            return NotFound();

        return Ok(disabled);
    }
}