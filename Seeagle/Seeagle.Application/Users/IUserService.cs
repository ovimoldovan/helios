using Seeagle.Domain.User;

namespace Seeagle.Application.Users;

public interface IUserService
{
    Task<UserDto> RegisterUserAsync(RegisterUserRequest request,CancellationToken cancellationToken);
    
    Task<User?> ValidateCredentialsAsync(LoginUserRequest request, CancellationToken cancellationToken);

    Task<UserListItemDto> AssignModeratorRoleAsync(Guid userId, CancellationToken cancellationToken);

    Task<User?> GetByIdAsync(Guid userId);
    
    Task<UserListItemDto?> RemoveModeratorAsync(Guid userId, CancellationToken cancellationToken);

    Task<UserDto> UpdateProfileAsync(Guid userId, UpdateProfileRequest request, CancellationToken cancellationToken);
    Task<bool> ChangePasswordAsync(Guid userId, ChangePasswordRequest request, CancellationToken cancellationToken);
}
