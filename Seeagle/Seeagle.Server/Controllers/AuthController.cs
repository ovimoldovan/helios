using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
using System.Security.Claims;
using Seeagle.Application.Users;
using Seeagle.Server.Utils.JWT;
using Seeagle.Server.Utils.Cookies;
using Seeagle.Server.Utils.EmailConfirmationToken;
using Seeagle.Server.Utils.MailService;
using Seeagle.Server.Utils.PasswordResetToken;

namespace Seeagle.Server.Controllers;

[ApiController]
[Route("api/auth")]
public sealed class AuthController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly IJwtUtil _jwtUtil;
    private readonly CookieSettings _cookieSettings;
    private readonly IMemoryCache _tokenBlacklist;
    private readonly IRefreshTokenService _refreshTokenService;
    private readonly EmailConfirmationTokenOptions _emailConfirmationTokenOptions;
    private readonly IEmailConfirmationTokenService _emailConfirmationTokenService;
    private readonly IMailService _mailService;
    private string _frontendUrl;
    private readonly ResetPasswordTokenOptions _resetPasswordTokenOptions;
    private readonly IResetPasswordTokenService _resetPasswordTokenService;

    public AuthController(
        IUserService userService, 
        IJwtUtil jwtUtil,
        IOptions<CookieSettings> cookieSettings, 
        IMemoryCache tokenBlacklist, 
        IRefreshTokenService refreshTokenService,
        IOptions<EmailConfirmationTokenOptions> emailConfirmationTokenOptions,
        IEmailConfirmationTokenService emailConfirmationTokenService,
        IMailService mailService, 
        IConfiguration configuration, 
        ResetPasswordTokenOptions resetPasswordTokenOptions,
        IResetPasswordTokenService resetPasswordTokenService)
    {
        _userService = userService;
        _jwtUtil = jwtUtil;
        _cookieSettings = cookieSettings.Value;
        _tokenBlacklist = tokenBlacklist;
        _refreshTokenService = refreshTokenService;
        _emailConfirmationTokenOptions = emailConfirmationTokenOptions.Value;
        _emailConfirmationTokenService = emailConfirmationTokenService;
        _mailService = mailService;
        _frontendUrl = configuration["FrontendBaseUrl"] ?? "";
        _resetPasswordTokenOptions = resetPasswordTokenOptions;
        _resetPasswordTokenService = resetPasswordTokenService;
    }

    [HttpPost("register")]
    public async Task<ActionResult<UserDto>> RegisterUser(RegisterUserRequest request, CancellationToken cancellationToken)
    {
        try
        {
            var created = await _userService.RegisterUserAsync(request, cancellationToken);
            var emailConfirmationToken = await _emailConfirmationTokenService.CreateAsync(created,
                    _emailConfirmationTokenOptions.ExpiryInDays,
                    cancellationToken);
            var url = $"{_frontendUrl}/confirm-email?user={created.Id}&token={emailConfirmationToken.Token}";
            await _mailService.SendEmailConfirmationAsync(created.Email, url);
            return Created($"/api/users/{created.Id}", created.Dto());
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> LoginAsync(LoginUserRequest request, CancellationToken cancellationToken)
    {
        var user = await _userService.ValidateCredentialsAsync(request, cancellationToken);
        
        if (user is null)
            return Unauthorized(new { message = "Invalid email or password" });

        var emailConfirmationToken = await _emailConfirmationTokenService.FindByUserIdAsync(user);
        if (emailConfirmationToken == null || !emailConfirmationToken.Used)
            return StatusCode(StatusCodes.Status403Forbidden, new { message = "Please confirm your email before logging in." });        
        
        var authToken = _jwtUtil.GenerateToken(user);
        var refreshToken = await _refreshTokenService.CreateAsync(user, _cookieSettings.RefreshTokenExpiryTimeSpanInDays, cancellationToken);
        
        var authTokenCookieOptions = new CookieOptions
        {
            Expires = DateTime.UtcNow.AddMinutes(_cookieSettings.AuthTokenExpiryTimeSpanInMinutes),
            Secure = _cookieSettings.SecurePolicy,
            SameSite = Enum.Parse<SameSiteMode>(_cookieSettings.SameSite),
            HttpOnly = _cookieSettings.HttpOnly
        };
        
        var refreshTokenCookieOptions = new CookieOptions
        {
            Expires = DateTime.UtcNow.AddDays(_cookieSettings.RefreshTokenExpiryTimeSpanInDays),
            Secure = _cookieSettings.SecurePolicy,
            SameSite = Enum.Parse<SameSiteMode>(_cookieSettings.SameSite),
            HttpOnly = _cookieSettings.HttpOnly
        };
        
        Response.Cookies.Append(_cookieSettings.AuthTokenName, authToken, authTokenCookieOptions);
        Response.Cookies.Append(_cookieSettings.RefreshTokenName, refreshToken.Token, refreshTokenCookieOptions);
        
        return Ok(new UserDto(
            user.Id,
            user.Email,
            user.FirstName,
            user.LastName,
            user.Role.ToString()
        ));
    }

    [Authorize]
    [HttpGet("me")]
    public ActionResult<UserDto> Me()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var email = User.FindFirstValue(ClaimTypes.Email);
        var firstName = User.FindFirstValue(ClaimTypes.GivenName);
        var lastName = User.FindFirstValue(ClaimTypes.Surname);
        var role = User.FindFirstValue(ClaimTypes.Role);

        if (string.IsNullOrWhiteSpace(userId) ||
            string.IsNullOrWhiteSpace(email) ||
            string.IsNullOrWhiteSpace(firstName) ||
            string.IsNullOrWhiteSpace(lastName) ||
            string.IsNullOrWhiteSpace(role))
        {
            return Unauthorized();
        }

        return Ok(new UserDto(
            Guid.Parse(userId),
            email,
            firstName,
            lastName,
            role
        ));
    }
    
    [Authorize]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout(CancellationToken cancellationToken)
    {
        var authToken = Request.Cookies[_cookieSettings.AuthTokenName];
        var refreshToken = Request.Cookies[_cookieSettings.RefreshTokenName];

        if (authToken == null || refreshToken == null)
            return Ok();
        
        Response.Cookies.Delete(_cookieSettings.AuthTokenName, new CookieOptions
        {
            Secure = _cookieSettings.SecurePolicy,
            SameSite = Enum.Parse<SameSiteMode>(_cookieSettings.SameSite),
            HttpOnly = _cookieSettings.HttpOnly
        });
        Response.Cookies.Delete(_cookieSettings.RefreshTokenName, new CookieOptions
        {
            Secure = _cookieSettings.SecurePolicy,
            SameSite = Enum.Parse<SameSiteMode>(_cookieSettings.SameSite),
            HttpOnly = _cookieSettings.HttpOnly
        });

        await _refreshTokenService.RevokeExistingAsync(refreshToken, cancellationToken);

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

    [HttpPost("refresh")]
    public async Task<IActionResult> RefreshAsync(CancellationToken cancellationToken)
    {
        var clientRefreshToken = Request.Cookies[_cookieSettings.RefreshTokenName];
        if (clientRefreshToken == null)
            return Unauthorized();

        var existing = await _refreshTokenService.GetByTokenAsync(clientRefreshToken, cancellationToken);
        if (existing == null)
            return Unauthorized();

        if (!existing.IsActive)
        {
            if (existing.Revoked != null)
            {
                await _refreshTokenService.RevokeAllActiveForUserAsync(existing.User.Id, cancellationToken); 
            }
            return Unauthorized();
        }
        
        await _refreshTokenService.RevokeExistingAsync(existing.Token, cancellationToken);

        var user = await _userService.GetByIdAsync(existing.User.Id);
        if (user == null)
            return Unauthorized();
        
        var newAuthToken = _jwtUtil.GenerateToken(user);
        var newRefreshToken = await _refreshTokenService.CreateAsync(user, _cookieSettings.RefreshTokenExpiryTimeSpanInDays, cancellationToken);
        
        var authTokenCookieOptions = new CookieOptions
        {
            Expires = DateTime.UtcNow.AddMinutes(_cookieSettings.AuthTokenExpiryTimeSpanInMinutes),
            Secure = _cookieSettings.SecurePolicy,
            SameSite = Enum.Parse<SameSiteMode>(_cookieSettings.SameSite),
            HttpOnly = _cookieSettings.HttpOnly
        };
        
        var refreshTokenCookieOptions = new CookieOptions
        {
            Expires = DateTime.UtcNow.AddDays(_cookieSettings.RefreshTokenExpiryTimeSpanInDays),
            Secure = _cookieSettings.SecurePolicy,
            SameSite = Enum.Parse<SameSiteMode>(_cookieSettings.SameSite),
            HttpOnly = _cookieSettings.HttpOnly
        };
        
        Response.Cookies.Append(_cookieSettings.AuthTokenName, newAuthToken, authTokenCookieOptions);
        Response.Cookies.Append(_cookieSettings.RefreshTokenName, newRefreshToken.Token, refreshTokenCookieOptions);

        return Ok();
    }
    
    [HttpPost("confirm-email")]
    public async Task<IActionResult> ConfirmEmailAsync(ConfirmEmailDto confirmEmailDto, CancellationToken cancellationToken)
    {
        var user = await _userService.GetByIdAsync(confirmEmailDto.UserId);

        if (user == null)
            return NotFound(new { message = "Invalid confirmation link" });
        
        bool success = await _emailConfirmationTokenService.ConfirmAsync(user, confirmEmailDto.Token, cancellationToken);

        if (!success)
            return BadRequest(new { message = "Email confirmation failed" });

        return Ok();
    }

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPasswordAsync(ForgotPasswordRequest request, CancellationToken cancellationToken)
    {
        var user = await _userService.GetByEmailAsync(request.Email);

        if (user != null)
        {
            var resetPasswordToken = await _resetPasswordTokenService.CreateAsync(user,
                _resetPasswordTokenOptions.ExpiryInMinutes, cancellationToken);
            var url = $"{_frontendUrl}/reset-password?token={resetPasswordToken.Token}";

            await _mailService.SendPasswordResetEmailAsync(user.Email, url);
        }

        return NoContent();
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPasswordAsync(ResetPasswordRequest request, CancellationToken cancellationToken)
    {
        var resetToken = await _resetPasswordTokenService.FindUnusedByTokenAsync(request.Token);
        
        if (resetToken is null || resetToken.Used || resetToken.Expires < DateTime.UtcNow)
            return BadRequest();

        await _userService.UpdatePasswordAsync(resetToken.User, request.NewPassword, cancellationToken);
        await _resetPasswordTokenService.UseTokenAsync(request.Token);
        await _refreshTokenService.RevokeAllActiveForUserAsync(resetToken.User.Id, cancellationToken);

        return NoContent();
    }
}