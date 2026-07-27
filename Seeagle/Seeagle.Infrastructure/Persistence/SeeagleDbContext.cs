using Microsoft.EntityFrameworkCore;
using Seeagle.Domain.SampleNames;
using Seeagle.Domain.Reports;

namespace Seeagle.Infrastructure.Persistence;

public sealed class SeeagleDbContext(DbContextOptions<SeeagleDbContext> options) : DbContext(options)
{
    public DbSet<SampleName> SampleNames => Set<SampleName>();
    public DbSet<Report> Reports => Set<Report>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(SeeagleDbContext).Assembly);
    }
}
