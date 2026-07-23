namespace Seeagle.Application.Users;
public interface IUserService
{
    Task<UserDto> RegisterUserAsync(RegisterUserRequest request,CancellationToken cancellationToken);
}
