using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Seeagle.Application.Users;
using Seeagle.Application.Common;

namespace Seeagle.Server.Controllers;

[ApiController]
[Route("api/users")]
[Authorize(Roles = "Admin")]
public sealed class UsersController(IUserQueryService _userQueryService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<PagedResult<UserListItemDto>>> GetUsersAsync([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10, CancellationToken cancellationToken = default)
    {
        var result = await _userQueryService.GetUsersAsync(pageNumber, pageSize, cancellationToken);
        return Ok(result);
    }
}