namespace Seeagle.Server.Utils.JWT;

public class JwtOptions
{
    public required string Secret { get; init; }
    public required int ExpiryInMinutes { get; init; }
}