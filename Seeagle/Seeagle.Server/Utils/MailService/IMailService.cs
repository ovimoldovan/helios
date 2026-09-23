using Seeagle.Domain.Reports;

namespace Seeagle.Server.Utils.MailService;

public interface IMailService
{
    Task SendEmailReportUpdateAsync(string to, string recipientName, string reportDescription, string moderatorMessage);
    
    Task SendEmailReportUpdateAsync(string to, string recipientName, string reportDescription, ReportStatus newStatus);

    Task SendEmailReportUpdateAsync(string to, string recipientName, string reportDescription, ReportStatus newStatus,
        string? moderatorMessage);

    Task SendEmailConfirmationAsync(string to, string url);
}