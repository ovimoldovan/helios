using Seeagle.Domain.User;

namespace Seeagle.Application.Users;

public interface IResetPasswordTokenService
{
    Task<ResetPasswordToken> CreateAsync(User user, int expiryInMinutes, CancellationToken cancellationToken);

    Task<ResetPasswordToken?> FindUnusedByTokenAsync(string token);

    Task UseTokenAsync(string token);
}