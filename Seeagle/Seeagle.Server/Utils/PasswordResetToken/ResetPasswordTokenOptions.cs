namespace Seeagle.Server.Utils.PasswordResetToken;

public class ResetPasswordTokenOptions
{
    public required int ExpiryInMinutes { get; init; }
}