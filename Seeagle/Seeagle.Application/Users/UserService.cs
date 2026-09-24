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

    public async Task<UserDto> UpdateProfileAsync(Guid userId, UpdateProfileRequest request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetAllQueryable()
            .FirstOrDefaultAsync(u => u.Id == userId, cancellationToken);

        if (user is null)
        {
            throw new InvalidOperationException("User not found.");
        }

        var normalizedEmail = request.Email.ToLowerInvariant().Trim();

        var emailTaken = await _userRepository.GetAllQueryable()
            .AnyAsync(u => u.Email == normalizedEmail && u.Id != userId, cancellationToken);

        if (emailTaken)
        {
            throw new InvalidOperationException("A user with the provided email already exists.");
        }

        user.UpdateProfile(normalizedEmail, request.FirstName.Trim(), request.LastName.Trim());
        await _userRepository.UpdateAsync(user, cancellationToken);

        return ConvertToDto(user);
    }

    public async Task<bool> ChangePasswordAsync(Guid userId, ChangePasswordRequest request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetAllQueryable()
            .FirstOrDefaultAsync(u => u.Id == userId, cancellationToken);

        if (user is null)
        {
            throw new InvalidOperationException("User not found.");
        }

        if (_passwordHasher.VerifyHashedPassword(user, user.PasswordHash, request.OldPassword) != PasswordVerificationResult.Success)
        {
            return false;
        }

        user.UpdatePassword(_passwordHasher.HashPassword(user, request.NewPassword));
        await _userRepository.UpdateAsync(user, cancellationToken);
        return true;
    }

    private UserDto ConvertToDto(User user)
    public async Task<User?> GetByEmailAsync(string email)
    {
        return await _userRepository.GetAllQueryable()
            .Where(user => user.Email == email)
            .FirstOrDefaultAsync();
    }

    public async Task UpdatePasswordAsync(User user, string newPassword, CancellationToken cancellationToken)
    {
        var existingUser = await _userRepository.GetAllQueryable()
            .Where(existing => existing.Id == user.Id)
            .FirstOrDefaultAsync();

        if (existingUser != null)
        {
            var newHashedPassword = _passwordHasher.HashPassword(existingUser, newPassword);
            existingUser.PasswordHash = newHashedPassword;
            await _userRepository.UpdateAsync(existingUser, cancellationToken);
        }
    }
}
       