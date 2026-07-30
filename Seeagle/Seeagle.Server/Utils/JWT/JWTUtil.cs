using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Seeagle.Domain.User;

namespace Seeagle.Server.Utils.JWT;

public class JwtUtil : IJwtUtil
{
    private readonly JwtOptions _jwtOptions;
    
    public JwtUtil(IOptions<JwtOptions> jwtOptions)
    {
        _jwtOptions = jwtOptions.Value;
    }
    
    public string GenerateToken(User user)
    {
        var claims = new []
        {
            new Claim("sub", user.Id.ToString()),
            new Claim("family_name", user.LastName),
            new Claim("given_name", user.FirstName),
            new Claim("email", user.Email)
        };
        
        var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(_jwtOptions.Secret));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(_jwtOptions.ExpiryInMinutes),
            signingCredentials: credentials
        );
        
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}