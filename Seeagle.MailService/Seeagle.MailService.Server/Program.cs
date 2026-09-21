using Microsoft.AspNetCore.HttpOverrides;
using RabbitMQ.Client;
using Resend;
using Seeagle.MailService.Server.Auth;
using Seeagle.MailService.Server.Consumers;
using Seeagle.MailService.Server.Utils.MailService;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.Configure<ResendSettings>(builder.Configuration.GetSection("ResendSettings"));
builder.Services.Configure<RabbitMqSettings>(builder.Configuration.GetSection("RabbitMqSettings"));

builder.Services.AddScoped<ApiKeyAuthFilter>();

builder.Services.AddResend(o =>
{
    o.ApiToken = builder.Configuration.GetSection("ResendSettings").Get<ResendSettings>()?.ApiKey
                 ?? throw new InvalidOperationException("Resend configuration is missing");
});

builder.Services.AddSingleton<IConnection>(_ =>
{
    var rabbitMqSettings = builder.Configuration.GetSection("RabbitMQSettings").Get<RabbitMqSettings>()
                           ?? throw new InvalidOperationException("Rabbit MQ settings are missing.");
    var factory = new ConnectionFactory
    {
        Uri = new Uri(rabbitMqSettings.Url)
    };

    return factory.CreateConnectionAsync().GetAwaiter().GetResult();
});

builder.Services.AddHostedService<EmailMessageConsumer>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

var forwardedHeadersOptions = new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
};
forwardedHeadersOptions.KnownIPNetworks.Clear();
forwardedHeadersOptions.KnownProxies.Clear();
app.UseForwardedHeaders(forwardedHeadersOptions);

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();