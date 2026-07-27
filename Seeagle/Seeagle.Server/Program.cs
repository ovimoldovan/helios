using Microsoft.EntityFrameworkCore;
using Seeagle.Application.Common;
using Seeagle.Application.SampleNames;
using Seeagle.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

SetupDatabase(builder);

builder.Services.AddScoped<ISampleNameService, SampleNameService>();

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