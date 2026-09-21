namespace Seeagle.Server.Utils.MailService;

public record EmailMessage(
    string To,
    Dictionary<string, object> Variables
);