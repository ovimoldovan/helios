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

        query = (sortBy?.ToLower(), sortDescending) switch
        {
            ("email", false) => query.OrderBy(u => u.Email),
            ("email", true) => query.OrderByDescending(u => u.Email),
            ("firstname", false) => query.OrderBy(u => u.FirstName),
            ("firstname", true) => query.OrderByDescending(u => u.FirstName),
            ("lastname", false) => query.OrderBy(u => u.LastName),
            ("lastname", true) => query.OrderByDescending(u => u.LastName),
            _ => query.OrderBy(u => u.Email)
        };

        var totalCount = await query.CountAsync(cancellationToken);

        var users = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Select(u => new UserListItemDto(u.Id, u.Email, u.FirstName, u.LastName, u.Role))
            .ToListAsync(cancellationToken);

        return new PagedResult<UserListItemDto>(users, totalCount, pageNumber, pageSize);
    }
}