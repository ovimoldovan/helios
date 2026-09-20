using System.Text.Json;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using Resend;

namespace Seeagle.MailService.Server.Consumers;

public class EmailMessageConsumer(IServiceScopeFactory serviceScopeFactory, IConnection connection) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        await using var channel = await connection.CreateChannelAsync();

        await DeclareExchangeAsync(channel);
        await DeclareQueueAsync(channel);
        await BindQueueAsync(channel);

        var consumer = new AsyncEventingBasicConsumer(channel);
        consumer.ReceivedAsync += async (_, ea) =>
        {
            try
            {
                var emailMessage = JsonSerializer.Deserialize<EmailMessage>(ea.Body.Span);
                if (emailMessage != null)
                {
                    using var scope = serviceScopeFactory.CreateScope();
                    var resend = scope.ServiceProvider.GetRequiredService<IResend>();
                    await resend.EmailSendAsync(emailMessage, ea.CancellationToken);
                } 
                await channel.BasicAckAsync(ea.DeliveryTag, multiple: false, ea.CancellationToken);
            }
            catch (JsonException)
            {
                await channel.BasicNackAsync(ea.DeliveryTag, multiple: false, requeue: false, stoppingToken);
            }
        };

        await channel.BasicConsumeAsync("mailworker", autoAck: false, consumer: consumer);
        
        await Task.Delay(Timeout.Infinite, stoppingToken);
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