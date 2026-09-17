using Resend;
using Seeagle.Domain.Reports;

namespace Seeagle.Server.Utils.MailService;

public class MailService(IResend resend, IServiceScopeFactory serviceScopeFactory) : IMailService
{
    public async Task SendEmail(string to, string recipientName, string reportDescription, string moderatorMessage)
    {
        using var scope = serviceScopeFactory.CreateScope();
        var mailFactory = scope.ServiceProvider.GetRequiredService<IMailFactory>();
        await resend.EmailSendAsync(
            mailFactory.CreateEmail(to, recipientName, reportDescription, moderatorMessage)
        );
    }

    public async Task SendEmail(string to, string recipientName, string reportDescription, ReportStatus newStatus)
    {
        using var scope = serviceScopeFactory.CreateScope();
        var mailFactory = scope.ServiceProvider.GetRequiredService<IMailFactory>();
        await resend.EmailSendAsync(
            mailFactory.CreateEmail(to, recipientName, reportDescription, newStatus)
        );
    }

    public async Task SendEmail(string to, string recipientName, string reportDescription, ReportStatus newStatus,
        string? moderatorMessage)
    {
        using var scope = serviceScopeFactory.CreateScope();
        var mailFactory = scope.ServiceProvider.GetRequiredService<IMailFactory>();
        if (moderatorMessage != null)
            await resend.EmailSendAsync(
                mailFactory.CreateEmail(to, recipientName, reportDescription, newStatus, moderatorMessage)
            );
        else
        {
            await resend.EmailSendAsync(
                mailFactory.CreateEmail(to, recipientName, reportDescription, newStatus)
            );
        }
    }
}