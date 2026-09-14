namespace Seeagle.Server.Utils.Cookies;

public class CookieSettings
{
    public string AuthTokenName { get; set; }
    public string RefreshTokenName { get; set; }
    public int AuthTokenExpiryTimeSpanInMinutes { get; set; }
    public int RefreshTokenExpiryTimeSpanInDays { get; set; }
    public bool HttpOnly { get; set; }
    public string SameSite { get; set; }
    public bool SecurePolicy { get; set; }
}