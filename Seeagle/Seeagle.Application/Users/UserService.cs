using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
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

    public async Task<User> RegisterUserAsync(RegisterUserRequest request, CancellationToken cancellationToken)
    {
        var normalizedEmail = request.Email.ToLowerInvariant().Trim();
        var emailExists = await _userRepository.GetAllQueryable()
            .AnyAsync(u => u.Email == normalizedEmail, cancellationToken);
        
        if (emailExists)
        {
            throw new InvalidOperationException("A user with the provided email already exists.");
        }
        
        var placeholderUser = new User(normalizedEmail, string.Empty, request.FirstName, request.LastName); 
        var hashedPassword = _passwordHasher.HashPassword(placeholderUser, request.Password);

        var user = new User(normalizedEmail, hashedPassword, request.FirstName.Trim(), request.LastName.Trim());
        await _userRepository.AddAsync(user, cancellationToken);
        return user;
    }

    public async Task<User?> ValidateCredentialsAsync(LoginUserRequest request, CancellationToken cancellationToken)
    {
        var normalizedEmail = request.Email.ToLowerInvariant().Trim();
        var user = await _userRepository.GetAllQueryable()
            .FirstOrDefaultAsync(u => u.Email == normalizedEmail, cancellationToken);

        if (user is null)
            return null;
        
        var isValid = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, request.Password) == PasswordVerificationResult.Success;

        return isValid ? user : null;
    }

    public async Task<UserListItemDto> AssignModeratorRoleAsync(Guid userId, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetAllQueryable()
            .FirstOrDefaultAsync(u => u.Id == userId, cancellationToken);

        if (user is null)
        {
            throw new InvalidOperationException("User not found.");
        }

        user.AssignModeratorRole();
        await _userRepository.UpdateAsync(user, cancellationToken);
        return new UserListItemDto(
            user.Id,
            user.Email,
            user.FirstName,
            user.LastName,
            user.Role
        );
    }
    
    public async Task<UserListItemDto?> RemoveModeratorAsync(Guid userId, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetAllQueryable()
            .FirstOrDefaultAsync(u => u.Id == userId, cancellationToken);

        if (user is null)
        {
            throw new InvalidOperationException("User not found.");
        }
        
        if (user.Role == Role.Admin)
        {
            throw new InvalidOperationException("Cannot remove moderator role from an admin.");
        }
        
        user.RemoveModeratorRole();
        await _userRepository.UpdateAsync(user, cancellationToken);
        return new UserListItemDto(
            user.Id,
            user.Email,
            user.FirstName,
            user.LastName,
            user.Role
        );
    }

    public async Task<User?> GetByIdAsync(Guid userId)
    {
        return await _userRepository.GetAllQueryable()
            .FirstOrDefaultAsync(u => u.Id == userId);
    }

    private UserDto ConvertToDto(User user)
    {
        return new UserDto(
            user.Id,
            user.Email,
            user.FirstName,
            user.LastName,
            user.Role.ToString()
        );
    }
}
       