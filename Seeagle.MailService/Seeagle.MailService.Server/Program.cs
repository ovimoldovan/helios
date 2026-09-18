using Microsoft.AspNetCore.HttpOverrides;
using Resend;
using Seeagle.MailService.Server.Utils.MailService;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.Configure<ResendSettings>(builder.Configuration.GetSection("ResendSettings"));

builder.Services.AddResend(o =>
{
    o.ApiToken = builder.Configuration.GetSection("ResendSettings").Get<ResendSettings>()?.ApiKey
                 ?? throw new InvalidOperationException("Resend configuration is missing");
});

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