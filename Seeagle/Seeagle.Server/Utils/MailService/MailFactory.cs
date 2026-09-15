using Microsoft.Extensions.Options;
using Resend;
using Seeagle.Domain.Reports;

namespace Seeagle.Server.Utils.MailService;

public class MailFactory : IMailFactory
{
    private readonly ResendSettings _resendSettings;

    public MailFactory(IOptions<ResendSettings> resendSettings)
    {
        _resendSettings = resendSettings.Value;
    }

    public EmailMessage CreateEmail(string to, string recipientName, string reportDescription, string moderatorMessage)
    {
        var variables = new Dictionary<string, object>
        {
            {"RecipientName", recipientName},
            {"ReportDescription", reportDescription},
            {"ModeratorMessage", moderatorMessage}
        };

        return new EmailMessage()
        {
            From = _resendSettings.From,
            To = to,
            Template = new EmailMessageTemplate()
            {
                TemplateId = _resendSettings.ReportMessageTemplateId,
                Variables = variables
            }
        };
    }

    public EmailMessage CreateEmail(string to, string recipientName, string reportDescription, ReportStatus newStatus)
    {
        var variables = new Dictionary<string, object>
        {
            {"RecipientName", recipientName},
            {"ReportDescription", reportDescription},
            {"StatusLabel", newStatus.ToString()}
        };
        
        return new EmailMessage()
        {
            From = _resendSettings.From,
            To = to,
            Template = new EmailMessageTemplate()
            {
                TemplateId = _resendSettings.ReportUpdateTemplateId,
                Variables = variables
            }
        };
    }

    public EmailMessage CreateEmail(string to, string recipientName, string reportDescription, ReportStatus newStatus,
        string moderatorMessage)
    {
        var variables = new Dictionary<string, object>
        {
            {"RecipientName", recipientName},
            {"ReportDescription", reportDescription},
            {"StatusLabel", newStatus.ToString()},
            {"ModeratorMessage", moderatorMessage}
        };
        
        return new EmailMessage()
        {
            From = _resendSettings.From,
            To = to,
            Template = new EmailMessageTemplate()
            {
                TemplateId = _resendSettings.ReportUpdateWithModeratorMessageTemplateId,
                Variables = variables
            }
        };
    }
}