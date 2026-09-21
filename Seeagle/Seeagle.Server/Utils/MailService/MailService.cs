using System.Text.Json;
using RabbitMQ.Client;
using Seeagle.Domain.Reports;

namespace Seeagle.Server.Utils.MailService;

public class MailService(IConnection connection) : IMailService
{
    public async Task SendEmailAsync(string to, string recipientName, string reportDescription, string moderatorMessage)
    {
        await using var channel = await connection.CreateChannelAsync();
        await DeclareExchangeAsync(channel);
        await DeclareQueueAsync(channel);
        var variables = new Dictionary<string, object>
        {
            {"RecipientName", recipientName},
            {"ReportDescription", reportDescription},
            {"ModeratorMessage", moderatorMessage}
        };
        var mail = new EmailMessage(to, variables);
        var body = JsonSerializer.SerializeToUtf8Bytes(mail);
        await PublishAsync(channel, body, messageKind: "ReportMessage");
    }

    public async Task SendEmailAsync(string to, string recipientName, string reportDescription, ReportStatus newStatus)
    {
        await using var channel = await connection.CreateChannelAsync();
        await DeclareExchangeAsync(channel);
        await DeclareQueueAsync(channel);
        
        var variables = new Dictionary<string, object>
        {
            {"RecipientName", recipientName},
            {"ReportDescription", reportDescription},
            {"StatusLabel", newStatus.ToString()}
        };
        var mail = new EmailMessage(to, variables);
        var body = JsonSerializer.SerializeToUtf8Bytes(mail);
        await PublishAsync(channel, body, messageKind: "ReportUpdate");
    }

    public async Task SendEmailAsync(string to, string recipientName, string reportDescription, ReportStatus newStatus,
        string? moderatorMessage)
    {
        await using var channel = await connection.CreateChannelAsync();
        await DeclareExchangeAsync(channel);    
        await DeclareQueueAsync(channel);

        Dictionary<string, object> variables;
        if (moderatorMessage != null)
            variables = new Dictionary<string, object>
            {
                {"RecipientName", recipientName},
                {"ReportDescription", reportDescription},
                {"StatusLabel", newStatus.ToString()},
                {"ModeratorMessage", moderatorMessage}
            };
        else
            variables = new Dictionary<string, object>
            {
                {"RecipientName", recipientName},
                {"ReportDescription", reportDescription},
                {"StatusLabel", newStatus.ToString()}
            };
        
        var mail = new EmailMessage(to, variables);
        var body = JsonSerializer.SerializeToUtf8Bytes(mail);
        var kind = moderatorMessage != null ? "ReportUpdateWithModeratorMessage" : "ReportUpdate";
        await PublishAsync(channel, body, messageKind: kind);
    }
    
    private async Task DeclareExchangeAsync(IChannel channel)
    {
        await channel.ExchangeDeclareAsync(
            exchange: "seeagle",
            type: ExchangeType.Direct,
            durable: true,
            autoDelete: false,
            arguments: null
        );
    }

    private async Task DeclareQueueAsync(IChannel channel)
    {
        await channel.QueueDeclareAsync(
            queue: "mailworker",
            durable: true,
            exclusive: false,
            autoDelete: false,
            arguments: new Dictionary<string, object?> { { "x-queue-type", "quorum" } } 
        );
    }

    private async Task PublishAsync(IChannel channel, byte[] body, string messageKind)
    {
        var props = new BasicProperties
        {
            ContentType = "application/json",
            Persistent = true,
            Type = messageKind
        };
        await channel.BasicPublishAsync(
            exchange: "seeagle",
            routingKey: "mailworker",
            basicProperties: props,
            mandatory: true,
            body: body
        );
    }
}