namespace Seeagle.Application.Users;

public sealed record UpdateProfileRequest(string Email, string FirstName, string LastName);