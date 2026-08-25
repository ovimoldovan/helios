using Microsoft.AspNetCore.Mvc;
using Seeagle.Application.ReportTypes;

namespace Seeagle.Server.Controllers;

[ApiController]
[Route("api/report-types")]
public sealed class ReportTypesController(IReportTypeService reportTypeService) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult<ReportTypeDto>> Create(
        [FromBody] CreateReportTypeRequest request,
        CancellationToken cancellationToken)
    {
        var result = await reportTypeService.CreateAsync(request, cancellationToken);
        return Ok(result);
    }
}