using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Seeagle.Application.Users;
using Seeagle.Application.Common;
using Seeagle.Domain.User;

namespace Seeagle.Server.Controllers;

[ApiController]
[Route("api/users")]
[Authorize(Roles = "Admin")]
public sealed class UsersController(IUserQueryService userQueryService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<PagedResult<UserListItemDto>>> GetUsersAsync(
        [FromQuery] int pageNumber = 1, 
        [FromQuery] int pageSize = 10,
        [FromQuery] string? searchTerm = null,
        [FromQuery] string? sortBy = null,
        [FromQuery] bool sortDescending = false,
        [FromQuery] Role? roleFilter = null,
        CancellationToken cancellationToken = default)
    {
        var result = await userQueryService.GetUsersAsync(pageNumber, pageSize, searchTerm, sortBy, roleFilter, sortDescending, cancellationToken);
        return Ok(result);
    }

    [HttpGet("{id}/assign-moderator")]
    public async Task<ActionResult<UserListItemDto>> AssignModeratorRoleAsync(Guid id, [FromServices] IUserService userService, CancellationToken cancellationToken = default)
    {
        try
        {
            var userDto = await userService.AssignModeratorRoleAsync(id, cancellationToken);
            return Ok(userDto);
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }
}