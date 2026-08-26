using Microsoft.EntityFrameworkCore;
using Seeagle.Domain.SampleNames;
using Seeagle.Domain.User;
using Seeagle.Domain.Reports;

namespace Seeagle.Infrastructure.Persistence;

public sealed class SeeagleDbContext(DbContextOptions<SeeagleDbContext> options) : DbContext(options)
{
    public DbSet<SampleName> SampleNames => Set<SampleName>();
    public DbSet<Report> Reports => Set<Report>();
    
    public DbSet<ReportType> ReportTypes => Set<ReportType>();
    
    public DbSet<User> Users => Set<User>();
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(SeeagleDbContext).Assembly);
    }
}
