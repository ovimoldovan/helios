using Microsoft.AspNetCore.Mvc;
using Seeagle.Application.Users;

namespace Seeagle.Server.Controllers;
[ApiController]
[Route("api/auth")]
public sealed class AuthController(IUserService userService) : ControllerBase
{
    [HttpPost("register")]
    public async Task<ActionResult<UserDto>> RegisterUser(RegisterUserRequest request, CancellationToken cancellationToken)
    {
        try
        {
            var created = await userService.RegisterUserAsync(request, cancellationToken);
            return Created($"/api/users/{created.Id}", created);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpPost("login")]
    public async Task<IActionResult> LoginAsync(LoginUserRequest request, CancellationToken cancellationToken)
    {
        var user = await userService.ValidateCredentialsAsync(request, cancellationToken);
        
        if (user is null)
            return Unauthorized(new { message = "Invalid email or password" });

        return Ok();

    }
}