namespace MehmetAsker.Application.Interfaces;

public interface IJwtService
{
    string GenerateAccessToken(Guid userId, string email, string role, Guid siteId);
    string GenerateRefreshToken();
}
