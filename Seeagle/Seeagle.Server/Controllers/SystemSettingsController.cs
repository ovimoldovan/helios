using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Seeagle.Application.Settings;

namespace Seeagle.Server.Controllers;

[ApiController]
[Route("api/system-settings")]
[Authorize(Roles = "Admin")]
public sealed class SystemSettingsController(ISystemSettingsService systemSettingsService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<SystemSettingsDto>> Get(CancellationToken cancellationToken)
    {
        var settings = await systemSettingsService.GetAsync(cancellationToken);
        return Ok(settings);
    }

    [HttpPut]
    public async Task<ActionResult<SystemSettingsDto>> Update(
        [FromBody] UpdateSystemSettingsRequest request,
        CancellationToken cancellationToken)
    {
        try
        {
            var settings = await systemSettingsService.UpdateAsync(request, cancellationToken);
            return Ok(settings);
        }
        catch (ArgumentOutOfRangeException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}