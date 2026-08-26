using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Seeagle.Application.Reports;

namespace Seeagle.Server.Controllers;

[ApiController]
[Route("api/report-types")]
public sealed class ReportTypesController(IReportTypeService reportTypeService) : ControllerBase
{
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
}