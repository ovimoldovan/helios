using Seeagle.Domain.User;

namespace Seeagle.Application.Users;

public interface IRefreshTokenService
{
    Task<RefreshToken> CreateAsync(User user, int expiryInDays, CancellationToken cancellationToken);

    Task<RefreshToken?> GetByTokenAsync(string token, CancellationToken cancellationToken);

    Task RevokeExistingAsync(string token, CancellationToken cancellationToken);

    Task RevokeAllActiveForUserAsync(Guid userId, CancellationToken cancellationToken);
}