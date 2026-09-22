using Seeagle.Domain.User;

namespace Seeagle.Application.Users;

public static class UserMapper
{
    extension(User user)
    {
        public UserDto Dto() => new UserDto(user.Id, user.Email, user.FirstName, user.LastName, user.Role.ToString());
    }
}