using Seeagle.Application.Common;
namespace Seeagle.Application.Users;

public interface IUserQueryService
{
    Task<PagedResult<UserListItemDto>> GetUsersAsync(int pageNumber, int pageSize, CancellationToken cancellationToken);
}