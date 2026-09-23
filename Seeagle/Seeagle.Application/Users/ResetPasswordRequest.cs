using System.ComponentModel.DataAnnotations;

namespace Seeagle.Application.Users;

public class ResetPasswordRequest
{
    [Required]
    public string Token { get; set; } = string.Empty;
    
    [Required]
    [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$",
    ErrorMessage = "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter and one number.")]
    public string NewPassword { get; set; } = string.Empty;
}