using Microsoft.EntityFrameworkCore;
using Seeagle.Domain.SampleNames;

namespace Seeagle.Infrastructure.Persistence;

public sealed class SeeagleDbContext(DbContextOptions<SeeagleDbContext> options) : DbContext(options)
{
    public DbSet<SampleName> SampleNames => Set<SampleName>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(SeeagleDbContext).Assembly);
    }
}
