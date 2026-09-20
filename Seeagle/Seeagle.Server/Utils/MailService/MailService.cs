using System.Text.Json;
using RabbitMQ.Client;
using Resend;
using Seeagle.Domain.Reports;

namespace Seeagle.Server.Utils.MailService;

public class MailService(IMailFactory mailFactory, IConnection connection) : IMailService
{
    public async Task SendEmailAsync(string to, string recipientName, string reportDescription, string moderatorMessage)
    {
        await using var channel = await connection.CreateChannelAsync();
        await DeclareExchangeAsync(channel);
        await DeclareQueueAsync(channel);
        var mail = mailFactory.CreateEmail(to, recipientName, reportDescription, moderatorMessage);
        var body = JsonSerializer.SerializeToUtf8Bytes(mail);
        await PublishAsync(channel, body);
    }

    public async Task SendEmailAsync(string to, string recipientName, string reportDescription, ReportStatus newStatus)
    {
        await using var channel = await connection.CreateChannelAsync();
        await DeclareExchangeAsync(channel);
        await DeclareQueueAsync(channel);
        var mail = mailFactory.CreateEmail(to, recipientName, reportDescription, newStatus);
        var body = JsonSerializer.SerializeToUtf8Bytes(mail);
        await PublishAsync(channel, body);
    }

    public async Task SendEmailAsync(string to, string recipientName, string reportDescription, ReportStatus newStatus,
        string? moderatorMessage)
    {
        await using var channel = await connection.CreateChannelAsync();
        await DeclareExchangeAsync(channel);    
        await DeclareQueueAsync(channel);
        EmailMessage mail;

        mail = moderatorMessage != null 
            ? mailFactory.CreateEmail(to, recipientName, reportDescription, newStatus, moderatorMessage)
            : mailFactory.CreateEmail(to, recipientName, reportDescription, newStatus);
        
        var body = JsonSerializer.SerializeToUtf8Bytes(mail);
        await PublishAsync(channel, body);
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

    private async Task PublishAsync(IChannel channel, byte[] body)
    {
        var props = new BasicProperties
        {
            ContentType = "application/json",
            Persistent = true
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