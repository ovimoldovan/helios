using Seeagle.Domain.User;

namespace Seeagle.Application.Users;

public interface IUserService
{
    Task<User> RegisterUserAsync(RegisterUserRequest request,CancellationToken cancellationToken);
    
    Task<User?> ValidateCredentialsAsync(LoginUserRequest request, CancellationToken cancellationToken);

    Task<UserListItemDto> AssignModeratorRoleAsync(Guid userId, CancellationToken cancellationToken);

    Task<User?> GetByIdAsync(Guid userId);
    
    Task<UserListItemDto?> RemoveModeratorAsync(Guid userId, CancellationToken cancellationToken);

    Task<User?> GetByEmailAsync(string email);

    Task UpdatePasswordAsync(User user, string newPassword, CancellationToken cancellationToken);
}
