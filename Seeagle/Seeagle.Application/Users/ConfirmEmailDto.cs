namespace Seeagle.Application.Users;

public record ConfirmEmailDto(
    Guid UserId,
    string Token
);