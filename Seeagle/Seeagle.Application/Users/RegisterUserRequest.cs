using System.ComponentModel.DataAnnotations;
namespace Seeagle.Application.Users;
public class RegisterUserRequest
{
    public const int maxNameLength = 30;
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MinLength(8)]
    [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$", 
    ErrorMessage = "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.")]
    public string Password { get; set; } = string.Empty;

    [Required]
    [MaxLength(maxNameLength)]

    public string FirstName { get; set; } = string.Empty;

    [Required]
    [MaxLength(maxNameLength)]
    public string LastName { get; set; } = string.Empty;
}