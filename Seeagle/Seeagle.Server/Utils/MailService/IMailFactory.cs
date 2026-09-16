using Resend;
using Seeagle.Domain.Reports;

namespace Seeagle.Server.Utils.MailService;

public interface IMailFactory
{
    EmailMessage CreateEmail(string to, string recipientName, string reportDescription, string moderatorMessage);
    
    EmailMessage CreateEmail(string to, string recipientName, string reportDescription, ReportStatus newStatus);

    EmailMessage CreateEmail(string to, string recipientName, string reportDescription, ReportStatus newStatus,
        string moderatorMessage);
}