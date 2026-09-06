using Seeagle.Application.Common;
using Seeagle.Domain.User;

namespace Seeagle.Application.Users;

public interface IUserQueryService
{
    Task<PagedResult<UserListItemDto>> GetUsersAsync(
        int pageNumber, 
        int pageSize, 
        string? searchTerm, 
        string? sortBy, 
        Role? roleFilter,
        bool sortDescending, 
        CancellationToken cancellationToken);
}