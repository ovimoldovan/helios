using System.ComponentModel.DataAnnotations;

namespace Seeagle.Application.Users;

public sealed record ChangePasswordRequest(string OldPassword, 
    [Required]
    [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$",ErrorMessage = "Password must be at least 8 characters and include uppercase, lowercase, a number, and a special character.")]
    string NewPassword);