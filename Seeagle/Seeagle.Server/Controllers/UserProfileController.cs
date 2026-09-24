using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Seeagle.Application.Users;
using System.Security.Claims;

namespace Seeagle.Server.Controllers;

[ApiController]
[Route("api/users/me")]
[Authorize]
public sealed class UserProfileController(IUserService userService) : ControllerBase
{
    [HttpPut("profile")]
    public async Task<ActionResult<UserDto>> UpdateProfile(
        UpdateProfileRequest request,
        CancellationToken cancellationToken)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized();
        }

        try
        {
            var updatedUser = await userService.UpdateProfileAsync(userId, request, cancellationToken);
            return Ok(updatedUser);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpPut("password")]
    public async Task<ActionResult> ChangePassword(ChangePasswordRequest request, CancellationToken cancellationToken)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized();
        }

        var success = await userService.ChangePasswordAsync(userId, request, cancellationToken);
        if (!success)
        {
            return BadRequest(new { message = "Current password is incorrect." });
        }

        return Ok();
    }
}