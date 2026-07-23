using Microsoft.AspNetCore.Identity;
using Seeagle.Application.Users;
using Seeagle.Domain.User;
using Seeagle.Application.Common;

namespace Seeagle.Application.Users;

public class UserService : IUserService
{
    private readonly IRepository<User> _userRepository;
    private readonly PasswordHasher<User> _passwordHasher = new ();
    public UserService(IRepository<User> userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<UserDto> RegisterUserAsync(RegisterUserRequest request, CancellationToken cancellationToken)
    {
        var normalizedEmail = request.Email.ToLowerInvariant().Trim();
        var existingUser = await _userRepository.GetAllAsync( cancellationToken);
        
        if (existingUser.Any(u => u.Email.Equals(normalizedEmail, StringComparison.OrdinalIgnoreCase)))
        {
            throw new InvalidOperationException("A user with the provided email already exists.");
        }
        
        var placeholderUser = new User(normalizedEmail, string.Empty, request.FirstName, request.LastName); 
        var hasedPassword = _passwordHasher.HashPassword(placeholderUser, request.Password);

        var user = new User(normalizedEmail, hasedPassword, request.FirstName, request.LastName);
        await _userRepository.AddAsync(user, cancellationToken);
        return ConvertToDto(user);

    }

    private UserDto ConvertToDto(User user)
    {
        return new UserDto(
            user.Id,
            user.Email,
            user.FirstName,
            user.LastName
        );
    }
}
       