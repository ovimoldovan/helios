namespace Seeagle.Server.Utils.JWT;

public class JwtOptions
{
    public required string Secret { get; init; }
    public required int ExpiryInMinutes { get; init; }
    public required string Issuer { get; init; }
    public required string Audience { get; init; }
}