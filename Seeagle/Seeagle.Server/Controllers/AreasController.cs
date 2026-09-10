using Microsoft.AspNetCore.Authorization;
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
    
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<AreaDto>>> GetAll(CancellationToken cancellationToken)
    {
        var areas = await areaService.GetAllAsync(cancellationToken);
        return Ok(areas);
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<AreaDto>> Update(
        Guid id,
        [FromBody] UpdateAreaRequest request,
        CancellationToken cancellationToken)
    {
        var result = await areaService.UpdateAsync(id, request, cancellationToken);
        
        if (result is null)
        {
            return NotFound();
        }
        
        return Ok(result);
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var deleted = await areaService.DeleteAsync(id, cancellationToken);
        
        if (!deleted)
        {
            return NotFound();
        }
        
        return NoContent();
    }
}