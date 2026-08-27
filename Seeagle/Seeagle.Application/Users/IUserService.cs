using Seeagle.Domain.User;

namespace Seeagle.Application.Users;

public interface IUserService
{
    Task<UserDto> RegisterUserAsync(RegisterUserRequest request,CancellationToken cancellationToken);
    
    Task<User?> ValidateCredentialsAsync(LoginUserRequest request, CancellationToken cancellationToken);

    Task<UserListItemDto> AssignModeratorRoleAsync(Guid userId, CancellationToken cancellationToken);
}
