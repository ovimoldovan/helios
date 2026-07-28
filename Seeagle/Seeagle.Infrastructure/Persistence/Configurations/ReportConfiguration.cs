using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Seeagle.Domain.Reports;

namespace Seeagle.Infrastructure.Persistence.Configurations;

public sealed class ReportConfiguration : IEntityTypeConfiguration<Report>
{
    public void Configure(EntityTypeBuilder<Report> builder)
    {
        builder.HasKey(r => r.Id);

        builder.Property(r => r.Latitude)
            .IsRequired();

        builder.Property(r => r.Longitude)
            .IsRequired();

        builder.Property(r => r.Description)
            .HasMaxLength(255);

        builder.Property(r => r.Status)
            .IsRequired();
    }
}