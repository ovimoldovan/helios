using Seeagle.Domain.Reports;

namespace Seeagle.Server.Utils.MailService;

public interface IMailService
{
    Task SendEmail(string to, string recipientName, string reportDescription, string moderatorMessage);
    
    Task SendEmail(string to, string recipientName, string reportDescription, ReportStatus newStatus);

    Task SendEmail(string to, string recipientName, string reportDescription, ReportStatus newStatus,
        string? moderatorMessage);
}