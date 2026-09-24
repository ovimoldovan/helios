using System.Text.Json;
using Microsoft.Extensions.Options;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using Resend;
using Seeagle.MailService.Server.Utils.MailService;

namespace Seeagle.MailService.Server.Consumers;

public class EmailMessageConsumer(IServiceScopeFactory serviceScopeFactory, IConnection connection) : BackgroundService
{
    private const int MaxRetries = 3;
    
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        await using var channel = await connection.CreateChannelAsync();

        await DeclareExchangeAsync(channel);
        await DeclareQueueAsync(channel);
        await DeclareDeadLetterQueueAsync(channel);
        await BindQueueAsync(channel);

        var consumer = new AsyncEventingBasicConsumer(channel);
        consumer.ReceivedAsync += async (_, ea) =>
        {
            try
            {
                using var scope = serviceScopeFactory.CreateScope();
                var resend = scope.ServiceProvider.GetRequiredService<IResend>();
                var resendSettings = scope.ServiceProvider.GetRequiredService<IOptions<ResendSettings>>().Value;

                using var doc = JsonDocument.Parse(ea.Body);
                var root = doc.RootElement;

                var to = root.GetProperty("To").GetString()!;
                var variables = root.GetProperty("Variables")
                    .EnumerateObject()
                    .ToDictionary(p => p.Name, p => (object)p.Value.ToString());

                var templateId = ea.BasicProperties.Type switch
                {
                    "ReportMessage" => resendSettings.ReportMessageTemplateId,
                    "ReportUpdate" => resendSettings.ReportUpdateTemplateId,
                    "ReportUpdateWithModeratorMessage" => resendSettings.ReportUpdateWithModeratorMessageTemplateId,
                    "EmailConfirmation" => resendSettings.EmailConfirmationTemplateId,
                    "ResetPassword" => resendSettings.PasswordResetTemplateId,
                    _ => null
                };

                if (templateId == null)
                {
                    await channel.BasicNackAsync(ea.DeliveryTag, multiple: false, requeue: false,
                        CancellationToken.None);
                    return;
                }

                var emailMessage = new EmailMessage
                {
                    From = resendSettings.From,
                    To = to,
                    Template = new EmailMessageTemplate
                    {
                        TemplateId = templateId,
                        Variables = variables
                    }
                };

                var response = await resend.EmailSendAsync(emailMessage, CancellationToken.None);
                if (!response.Success && response.Exception != null)
                    throw response.Exception;
                await channel.BasicAckAsync(ea.DeliveryTag, multiple: false, CancellationToken.None);
            }
            catch (JsonException)
            {
                await channel.BasicNackAsync(ea.DeliveryTag, multiple: false, requeue: false, CancellationToken.None);
            }
            catch (ResendException)
            {
                await HandleFailureAsync(channel, ea);
            }
        };

        await channel.BasicConsumeAsync("mailworker", autoAck: false, consumer: consumer);
        
        await Task.Delay(Timeout.Infinite, stoppingToken);
    }

    private async Task HandleFailureAsync(IChannel channel, BasicDeliverEventArgs ea)
    {
        var retryCount = GetRetryCount(ea.BasicProperties);

        if (retryCount < MaxRetries)
        {
            await RepublishWithIncrementedRetryAsync(channel, ea, retryCount + 1);
            await channel.BasicAckAsync(ea.DeliveryTag, multiple: false, CancellationToken.None);
        }
        else
        {
            await PublishToDeadLetterAsync(channel, ea);
            await channel.BasicAckAsync(ea.DeliveryTag, multiple: false, CancellationToken.None);
        }
    }
    
    private static int GetRetryCount(IReadOnlyBasicProperties props)
    {
        if (props.Headers != null && props.Headers.TryGetValue("x-retry-count", out var value) && value is byte[] bytes)
        {
            return int.Parse(System.Text.Encoding.UTF8.GetString(bytes));
        }
        return 0;
    }
    
    private async Task RepublishWithIncrementedRetryAsync(IChannel channel, BasicDeliverEventArgs ea, int newRetryCount)
    {
        var props = new BasicProperties
        {
            ContentType = ea.BasicProperties.ContentType,
            Persistent = true,
            Type = ea.BasicProperties.Type,
            Headers = new Dictionary<string, object?>
            {
                ["x-retry-count"] = newRetryCount
            }
        };

        await channel.BasicPublishAsync(
            exchange: "seeagle",
            routingKey: "mailworker",
            basicProperties: props,
            mandatory: true,
            body: ea.Body.ToArray()
        );
    }
    
    private async Task PublishToDeadLetterAsync(IChannel channel, BasicDeliverEventArgs ea)
    {
        var props = new BasicProperties
        {
            ContentType = ea.BasicProperties.ContentType,
            Persistent = true,
            Type = ea.BasicProperties.Type,
            Headers = ea.BasicProperties.Headers
        };

        await channel.BasicPublishAsync(
            exchange: "",
            routingKey: "mailworker.failed",
            basicProperties: props,
            mandatory: false,
            body: ea.Body.ToArray()
        );
    }
    
    private async Task DeclareDeadLetterQueueAsync(IChannel channel)
    {
        await channel.QueueDeclareAsync(
            queue: "mailworker.failed",
            durable: true,
            exclusive: false,
            autoDelete: false,
            arguments: new Dictionary<string, object?> { { "x-queue-type", "quorum" } }
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

    private async Task BindQueueAsync(IChannel channel)
    {
        await channel.QueueBindAsync(
            queue: "mailworker",
            exchange: "seeagle",
            routingKey: "mailworker"
        );
    }
}