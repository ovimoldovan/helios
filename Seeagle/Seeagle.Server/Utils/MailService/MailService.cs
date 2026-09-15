using Resend;
using Seeagle.Domain.Reports;

namespace Seeagle.Server.Utils.MailService;

public class MailService(IResend resend, IMailFactory mailFactory) : IMailService
{
    public async Task SendEmail(string to, string recipientName, string reportDescription, string moderatorMessage)
    {
        await resend.EmailSendAsync(
            mailFactory.CreateEmail(to, recipientName, reportDescription, moderatorMessage)
        );
    }

    public async Task SendEmail(string to, string recipientName, string reportDescription, ReportStatus newStatus)
    {
        await resend.EmailSendAsync(
            mailFactory.CreateEmail(to, recipientName, reportDescription, newStatus)
        );
    }

    public async Task SendEmail(string to, string recipientName, string reportDescription, ReportStatus newStatus,
        string moderatorMessage)
    {
        await resend.EmailSendAsync(
            mailFactory.CreateEmail(to, recipientName, reportDescription, newStatus, moderatorMessage)
        );
    }
}