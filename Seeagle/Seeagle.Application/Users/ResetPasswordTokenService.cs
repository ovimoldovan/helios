using Microsoft.EntityFrameworkCore;
using Seeagle.Application.Common;
using Seeagle.Domain.User;

namespace Seeagle.Application.Users;

public class ResetPasswordTokenService : IResetPasswordTokenService
{
    private readonly IRepository<ResetPasswordToken> _resetPasswordTokenRepository;

    public ResetPasswordTokenService(IRepository<ResetPasswordToken> resetPasswordTokenRepository)
    {
        _resetPasswordTokenRepository = resetPasswordTokenRepository;
    }

    public async Task<ResetPasswordToken> CreateAsync(User user, int expiryInMinutes, CancellationToken cancellationToken)
    {
        var token = new ResetPasswordToken(user, expiryInMinutes);
        await _resetPasswordTokenRepository.AddAsync(token, cancellationToken);
        return token;
    }

    public async Task<ResetPasswordToken?> FindUnusedByTokenAsync(string token)
    {
        return await _resetPasswordTokenRepository.GetAllQueryable()
            .Where(resetPasswordToken => resetPasswordToken.Token == token && !resetPasswordToken.Used)
            .FirstOrDefaultAsync();
    }

    public async Task UseTokenAsync(string token)
    {
        var existing = await _resetPasswordTokenRepository.GetAllQueryable()
            .Where(resetPasswordToken => resetPasswordToken.Token == token && !resetPasswordToken.Used)
            .FirstAsync();
        
        existing.Use();
    }
}