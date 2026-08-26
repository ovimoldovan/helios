using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using Seeagle.Application.Common;
using Seeagle.Application.SampleNames;
using Seeagle.Infrastructure.Persistence;
using Seeagle.Application.Users;
using Seeagle.Application.Reports;
using Seeagle.Server.Utils.JWT;
using Swashbuckle.AspNetCore.Filters;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter your JWT token."
    });
    
    options.OperationFilter<SecurityRequirementsOperationFilter>(true, "Bearer");
});

builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<ISampleNameService, SampleNameService>();
builder.Services.AddScoped<IReportService, ReportService>();
builder.Services.AddScoped<IUserQueryService, UserQueryService>();
builder.Services.AddScoped<IReportTypeService, ReportTypeService>();
builder.Services.AddScoped<IReportQueryService, ReportQueryService>();
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
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOptions.Secret)),
            ValidateIssuer = false,   
            ValidateAudience = false
        };
    });
builder.Services.AddAuthorization();
SetupDatabase(builder);

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<SeeagleDbContext>();
    dbContext.Database.Migrate();
}

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

    builder.Services.AddDbContext<SeeagleDbContext>(options => options.UseNpgsql(connectionString, npgsqlOptions => npgsqlOptions.UseNetTopologySuite()));

    builder.Services.AddScoped(typeof(IRepository<>), typeof(EfRepository<>));
}