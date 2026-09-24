using System.Security.Cryptography;

namespace Seeagle.Domain.User;

public class EmailConfirmationToken
{
    private EmailConfirmationToken()
    {
        Token = null!;
        User = null!;
    }

    public EmailConfirmationToken(User user, int expiryInDays)
    {
        Id = Guid.NewGuid();
        User = user;
        Expires = DateTime.UtcNow.AddDays(expiryInDays);
        Token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(32))
                .Replace("+", "-").Replace("/", "_").Replace("=", "");
    }
    
    public Guid Id { get; private set; }
    public string Token { get; private set; }
    public User User { get; private set; }
    public DateTime CreatedUtc { get; private set; } = DateTime.UtcNow;
    public DateTime Expires { get; private set; }
    public bool Used { get; private set; } = false;

    public void Confirm()
    {
        Used = true;
    }
}