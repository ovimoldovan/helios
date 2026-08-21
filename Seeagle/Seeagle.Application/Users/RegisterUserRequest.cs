using System.ComponentModel.DataAnnotations;
namespace Seeagle.Application.Users;
public class RegisterUserRequest
{
    private const int MaxNameLength = 30;
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$", 
    ErrorMessage = "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter and one number.")]
    public string Password { get; set; } = string.Empty;

    [Required]
    [MaxLength(MaxNameLength)]

    public string FirstName { get; set; } = string.Empty;

    [Required]
    [MaxLength(MaxNameLength)]
    public string LastName { get; set; } = string.Empty;
}