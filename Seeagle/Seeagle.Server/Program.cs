using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Seeagle.Application.Common;
using Seeagle.Application.SampleNames;
using Seeagle.Infrastructure.Persistence;
using Seeagle.Application.Users;
using Seeagle.Application.Reports;
using Seeagle.Server.Utils.JWT;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<ISampleNameService, SampleNameService>();
builder.Services.AddScoped<IReportService, ReportService>();

builder.Services.Configure<JwtOptions>(builder.Configuration.GetSection("Jwt"));
builder.Services.AddScoped<IJwtUtil, JwtUtil>();
var jwtOptions = builder.Configuration.GetSection("Jwt").Get<JwtOptions>()
                 ?? throw new InvalidOperationException("Jwt configuration is missing.");
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOptions.Secret))
        };
    });
builder.Services.AddAuthorization();
SetupDatabase(builder);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    using var scope = app.Services.CreateScope();
    var dbContext = scope.ServiceProvider.GetRequiredService<SeeagleDbContext>();
    dbContext.Database.Migrate();

    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseDefaultFiles();
app.MapStaticAssets();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();

static void SetupDatabase(WebApplicationBuilder builder)
{
    var connectionString = builder.Configuration.GetConnectionString("SeeagleDatabase")
        ?? throw new InvalidOperationException("Connection string 'SeeagleDatabase' was not found.");

    builder.Services.AddDbContext<SeeagleDbContext>(options => options.UseNpgsql(connectionString));

    builder.Services.AddScoped(typeof(IRepository<>), typeof(EfRepository<>));
}