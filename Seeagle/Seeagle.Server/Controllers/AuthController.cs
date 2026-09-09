using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Seeagle.Application.Users;
using Seeagle.Server.Utils.JWT;
using Seeagle.Server.Utils.Cookies;

namespace Seeagle.Server.Controllers;

[ApiController]
[Route("api/auth")]
public sealed class AuthController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly IJwtUtil _jwtUtil;
    private readonly CookieSettings _cookieSettings;

    public AuthController(
        IUserService userService, 
        IJwtUtil jwtUtil,
        IOptions<CookieSettings> cookieSettings)
    {
        _userService = userService;
        _jwtUtil = jwtUtil;
        _cookieSettings = cookieSettings.Value;
    }

    [HttpPost("register")]
    public async Task<ActionResult<UserDto>> RegisterUser(RegisterUserRequest request, CancellationToken cancellationToken)
    {
        try
        {
            var created = await _userService.RegisterUserAsync(request, cancellationToken);
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
        var user = await _userService.ValidateCredentialsAsync(request, cancellationToken);
        
        if (user is null)
            return Unauthorized(new { message = "Invalid email or password" });
        
        var token = _jwtUtil.GenerateToken(user);
        
        var cookieOptions = new CookieOptions
        {
            Expires = DateTime.UtcNow.AddMinutes(_cookieSettings.ExpireTimeSpanMinutes),
            Secure = _cookieSettings.SecurePolicy,
            SameSite = Enum.Parse<SameSiteMode>(_cookieSettings.SameSite),
            HttpOnly = _cookieSettings.HttpOnly
        };
        
        Response.Cookies.Append(_cookieSettings.Name, token, cookieOptions);
        
        return Ok();
    }

    [HttpPost("logout")]
    public IActionResult Logout()
    {
        Response.Cookies.Delete(_cookieSettings.Name, new CookieOptions
        {
            Expires = DateTime.UtcNow.AddMinutes(_cookieSettings.ExpireTimeSpanMinutes),
            Secure = _cookieSettings.SecurePolicy,
            SameSite = Enum.Parse<SameSiteMode>(_cookieSettings.SameSite),
            HttpOnly = _cookieSettings.HttpOnly
        });
        
        return Ok();
    }
}