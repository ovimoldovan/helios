using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Seeagle.Application.Common;
using Seeagle.Application.Reports;

namespace Seeagle.Server.Controllers;

[ApiController]
[Route("api/report-types")]
public sealed class ReportTypesController(IReportTypeService reportTypeService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<PagedResult<ReportTypeDto>>> GetAsync(
        [FromServices] IReportTypeQueryService reportTypeQueryService, [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10, [FromQuery] bool onlyActive = false,
        CancellationToken cancellationToken = default)
    {
        return Ok(await reportTypeQueryService.GetReportTypesAsync(pageNumber, pageSize, cancellationToken,
            onlyActive));
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
    public async Task<ActionResult<ReportTypeDto>> Update(Guid id, UpdateReportTypeRequest request,
        CancellationToken cancellationToken)
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

    [HttpPut("{id:guid}/change_status")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ReportTypeDto>> ChangeStatus(Guid id, CancellationToken cancellationToken)
    {
        var changedStatusReportType = await reportTypeService.ChangeStatusAsync(id, cancellationToken);

        if (changedStatusReportType is null)
            return NotFound();

        return Ok(changedStatusReportType);
    }
}