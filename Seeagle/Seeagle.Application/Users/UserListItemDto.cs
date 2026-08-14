using Seeagle.Domain.User;

namespace Seeagle.Application.Users;

public sealed record UserListItemDto(Guid Id, string Email, string FirstName, string LastName, Role Role);