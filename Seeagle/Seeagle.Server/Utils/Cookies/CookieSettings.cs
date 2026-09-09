namespace Seeagle.Server.Utils.Cookies;

public class CookieSettings
{
    public string Name { get; set; }
    public double ExpireTimeSpanMinutes { get; set; }
    public bool SlidingExpiration { get; set; }
    public bool HttpOnly { get; set; }
    public string SameSite { get; set; }
    public bool SecurePolicy { get; set; }
}