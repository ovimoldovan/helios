using System.ComponentModel.DataAnnotations;

namespace Seeagle.Application.Users;

public class LoginUserRequest
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
    
    [Required]
    public string Password { get; set; } = string.Empty;
}