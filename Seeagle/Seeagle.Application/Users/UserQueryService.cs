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

    public async Task<PagedResult<UserListItemDto>> GetUsersAsync(
        int pageNumber, 
        int pageSize, 
        string? searchTerm, 
        string? sortBy, 
        Role? roleFilter,   
        bool sortDescending, 
        CancellationToken cancellationToken)
    {
        var query = _userRepository.GetAllQueryable();

        if (roleFilter.HasValue)
        {
            query = query.Where(u => u.Role == roleFilter.Value);
        }
        
        if (!string.IsNullOrEmpty(searchTerm))
        {
            query = query.Where(u => u.Email.ToLower().Contains(searchTerm.ToLower()) || 
            u.FirstName.ToLower().Contains(searchTerm.ToLower()) || 
            u.LastName.ToLower().Contains(searchTerm.ToLower()));
        }

        IQueryable<User> sortedQuery = sortBy?.ToLower() switch
        {
            var s when s == nameof(User.Email).ToLower() => sortDescending ? query.OrderByDescending(u => u.Email) : query.OrderBy(u => u.Email),
            var s when s == nameof(User.FirstName).ToLower() => sortDescending ? query.OrderByDescending(u => u.FirstName) : query.OrderBy(u => u.FirstName),
            var s when s == nameof(User.LastName).ToLower() => sortDescending ? query.OrderByDescending(u => u.LastName) : query.OrderBy(u => u.LastName),
            _ => query.OrderBy(u => u.Id)
        };
        var totalCount = await query.CountAsync(cancellationToken);

        var users = await sortedQuery   
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Select(u => new UserListItemDto(u.Id, u.Email, u.FirstName, u.LastName, u.Role))
            .ToListAsync(cancellationToken);

        return new PagedResult<UserListItemDto>(users, totalCount, pageNumber, pageSize);
    }
}