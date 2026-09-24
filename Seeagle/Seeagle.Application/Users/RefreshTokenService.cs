using Microsoft.EntityFrameworkCore;
using Seeagle.Application.Common;
using Seeagle.Domain.User;

namespace Seeagle.Application.Users;

public class RefreshTokenService : IRefreshTokenService
{
    private readonly IRepository<RefreshToken> _refreshTokenRepository;

    public RefreshTokenService(IRepository<RefreshToken> refreshTokenRepository)
    {
        _refreshTokenRepository = refreshTokenRepository;
    }


    public async Task<RefreshToken> CreateAsync(User user, int expiryInDays, bool keepMeLoggedIn, CancellationToken cancellationToken)
    {
        var token = new RefreshToken(user, expiryInDays, keepMeLoggedIn);
        await _refreshTokenRepository.AddAsync(token, cancellationToken);
        return token;
    }

    public async Task<RefreshToken?> GetByTokenAsync(string token, CancellationToken cancellationToken)
    {
        return await _refreshTokenRepository.GetAllQueryable()
            .Include(refreshToken => refreshToken.User)
            .FirstOrDefaultAsync(refreshToken => refreshToken.Token == token);
    }

    public async Task RevokeExistingAsync(string token, CancellationToken cancellationToken)
    {
        var existing = await _refreshTokenRepository.GetAllQueryable()
            .FirstOrDefaultAsync(refreshToken => refreshToken.Token == token);

        if (existing != null)
        {
            existing.Revoked = DateTime.UtcNow;
            await _refreshTokenRepository.UpdateAsync(existing, cancellationToken);
        }
    }

    public async Task RevokeAllActiveForUserAsync(Guid userId, CancellationToken cancellationToken)
    {
        var userTokens = await _refreshTokenRepository.GetAllQueryable()
            .Where(refreshToken => refreshToken.User.Id == userId)
            .ToListAsync();

        foreach (var refreshToken in userTokens)
        {
            refreshToken.Revoked = DateTime.UtcNow;
            await _refreshTokenRepository.UpdateAsync(refreshToken, cancellationToken);
        }
    }
}