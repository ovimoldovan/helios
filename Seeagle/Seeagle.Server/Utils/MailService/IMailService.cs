using Seeagle.Domain.Reports;

namespace Seeagle.Server.Utils.MailService;

public interface IMailService
{
    Task SendEmailAsync(string to, string recipientName, string reportDescription, string moderatorMessage);
    
    Task SendEmailAsync(string to, string recipientName, string reportDescription, ReportStatus newStatus);

    Task SendEmailAsync(string to, string recipientName, string reportDescription, ReportStatus newStatus,
        string? moderatorMessage);
}