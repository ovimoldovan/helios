using Microsoft.EntityFrameworkCore;
using Seeagle.Application.Common;
using Seeagle.Domain.User;

namespace Seeagle.Application.Users;

public class EmailConfirmationTokenService : IEmailConfirmationTokenService
{
    private readonly IRepository<EmailConfirmationToken> _emailConfirmationTokenRepository;

    public EmailConfirmationTokenService(IRepository<EmailConfirmationToken> emailConfirmationTokenRepository)
    {
        _emailConfirmationTokenRepository = emailConfirmationTokenRepository;
    }

    public async Task<EmailConfirmationToken> CreateAsync(User user, int expiryInDays, CancellationToken cancellationToken)
    {
        var token = new EmailConfirmationToken(user, expiryInDays);
        await _emailConfirmationTokenRepository.AddAsync(token, cancellationToken);
        return token;
    }

    public async Task<bool> ConfirmAsync(User user, string token, CancellationToken cancellationToken)
    {
        var existingToken = await _emailConfirmationTokenRepository.GetAllQueryable()
            .Where(existingToken => existingToken.User.Id == user.Id && existingToken.Token == token)
            .FirstOrDefaultAsync();

        if (existingToken == null || existingToken.Used || existingToken.Expires < DateTime.UtcNow)
            return false;

        existingToken.Confirm();
        await _emailConfirmationTokenRepository.UpdateAsync(existingToken, cancellationToken);
        return true;
    }

    public async Task<EmailConfirmationToken?> FindByUserIdAsync(User user)
    {
        var existingToken = await _emailConfirmationTokenRepository.GetAllQueryable()
            .Where(existingToken => existingToken.User.Id == user.Id)
            .FirstOrDefaultAsync();

        return existingToken;
    }
}