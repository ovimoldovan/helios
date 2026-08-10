using Microsoft.EntityFrameworkCore;
using Seeagle.Application.Common;
using Seeagle.Domain.User;

namespace Seeagle.Application.Users;

public sealed class UserQueryService : IUserQueryService
{
    private readonly IRepository<User> _userRepository;

    public UserQueryService(IRepository<User> userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<PagedResult<UserListItemDto>> GetUsersAsync(int pageNumber, int pageSize, CancellationToken cancellationToken)
    {
        var query = _userRepository.GetAllQueryable();

        var totalCount = await query.CountAsync(cancellationToken);

        var users = await query
            .OrderBy(u => u.Email)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Select(u => new UserListItemDto(u.Id, u.Email, u.FirstName, u.LastName, u.Role))
            .ToListAsync(cancellationToken);

        return new PagedResult<UserListItemDto>(users, totalCount, pageNumber, pageSize);
    }
}