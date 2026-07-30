using Seeagle.Domain.User;

namespace Seeagle.Server.Utils.JWT;

public interface IJwtUtil
{
    string GenerateToken(User user);
}