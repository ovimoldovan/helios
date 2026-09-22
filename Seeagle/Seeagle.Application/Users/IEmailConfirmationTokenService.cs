using Seeagle.Domain.User;

namespace Seeagle.Application.Users;

public interface IEmailConfirmationTokenService
{
    Task<EmailConfirmationToken> CreateAsync(User user, int expiryInDays, CancellationToken cancellationToken);

    Task<bool> ConfirmAsync(User user, string token, CancellationToken cancellationToken);

    Task<EmailConfirmationToken?> FindByUserIdAsync(User user);
}