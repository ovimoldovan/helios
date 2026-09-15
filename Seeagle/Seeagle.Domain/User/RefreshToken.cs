using System.Security.Cryptography;

namespace Seeagle.Domain.User;

public class RefreshToken
{
    private RefreshToken()
    {
        Token = null!;
        User = null!;
    }

    public RefreshToken(User user, int expiryInDays)
    {
        Id = Guid.NewGuid();
        User = user;
        Expires = DateTime.UtcNow.AddDays(expiryInDays);
        Token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
    }
    
    public Guid Id { get; private set; }
    public string Token { get; private set; }
    public User User { get; private set; }
    public DateTime CreatedUtc { get; private set; } = DateTime.UtcNow;
    public DateTime Expires { get; private set; }
    public DateTime? Revoked { get; set; }
    public bool IsActive => Revoked is null && DateTime.UtcNow < Expires;
}