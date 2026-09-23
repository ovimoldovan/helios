using System.Security.Cryptography;

namespace Seeagle.Domain.User;

public class ResetPasswordToken
{
    private ResetPasswordToken()
    {
        Token = null!;
        User = null!;
    }

    public ResetPasswordToken(User user, int expiryInMinutes)
    {
        Id = Guid.NewGuid();
        User = user;
        Expires = DateTime.UtcNow.AddMinutes(expiryInMinutes);
        Token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(32))
            .Replace("+", "-").Replace("/", "_").Replace("=", "");
    }
    
    public Guid Id { get; private set; }
    public string Token { get; private set; }
    public User User { get; private set; }
    public DateTime CreatedUtc { get; private set; } = DateTime.UtcNow;
    public DateTime Expires { get; private set; }
    public bool Used { get; private set; } = false;

    public void Use()
    {
        Used = true;
    }
}