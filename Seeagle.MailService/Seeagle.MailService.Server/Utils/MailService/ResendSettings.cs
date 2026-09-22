namespace Seeagle.MailService.Server.Utils.MailService;

public class ResendSettings
{
    public required string ApiKey { get; init; }
    public required string ReportMessageTemplateId { get; init; }
    public required string ReportUpdateWithModeratorMessageTemplateId { get; init; }
    public required string ReportUpdateTemplateId { get; init; }
    public required string EmailConfirmationTemplateId { get; init; }
    public required string From { get; init; }
}