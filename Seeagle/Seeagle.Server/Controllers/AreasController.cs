using Microsoft.AspNetCore.Mvc;
using Seeagle.Application.Areas;

namespace Seeagle.Server.Controllers;

[ApiController]
[Route("api/areas")]
public sealed class AreasController(IAreaService areaService) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult<AreaDto>> Create(
        [FromBody] CreateAreaRequest request,
        CancellationToken cancellationToken)
    {
        var result = await areaService.CreateAsync(request, cancellationToken);
        return Ok(result);
    }
}