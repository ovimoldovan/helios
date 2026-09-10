using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
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
    private readonly IMemoryCache _tokenBlacklist;

    public AuthController(
        IUserService userService, 
        IJwtUtil jwtUtil,
        IOptions<CookieSettings> cookieSettings, 
        IMemoryCache tokenBlacklist)
    {
        _userService = userService;
        _jwtUtil = jwtUtil;
        _cookieSettings = cookieSettings.Value;
        _tokenBlacklist = tokenBlacklist;
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
    
    //TODO: Add refresh token logic
    //TODO: Store refrehs tokens as a column in the DB with a TTL, when the user logs-in, check if the refresh token is expired, and if yes, issue a new one
    [Authorize]
    [HttpPost("logout")]
    public IActionResult Logout()
    {
        var authToken = Request.Cookies[_cookieSettings.Name]!;
        
        Response.Cookies.Delete(_cookieSettings.Name, new CookieOptions
        {
            Secure = _cookieSettings.SecurePolicy,
            SameSite = Enum.Parse<SameSiteMode>(_cookieSettings.SameSite),
            HttpOnly = _cookieSettings.HttpOnly
        });

        if (_tokenBlacklist.TryGetValue(authToken, out _))
        {
            return BadRequest();
        }
        
        var jwt = new JwtSecurityTokenHandler().ReadJwtToken(authToken);
        var expiresUtc = jwt.ValidTo;
        var remaining = expiresUtc - DateTime.UtcNow;
        if (remaining <= TimeSpan.Zero)
        {
            return Ok();
        }
        
        var cacheEntryOptions = new MemoryCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = remaining
        };

        _tokenBlacklist.Set(authToken,
            DateTime.UtcNow.AddMinutes(remaining.Minutes), 
            cacheEntryOptions);
        
        return Ok();
    }
}