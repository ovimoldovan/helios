using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Seeagle.Domain.Reports;

namespace Seeagle.Infrastructure.Persistence.Configurations;

public sealed class ReportTypeConfiguration : IEntityTypeConfiguration<ReportType>
{
    public void Configure(EntityTypeBuilder<ReportType> builder)
    {
        builder.HasKey(rt => rt.Id);

        builder.HasIndex(rt => rt.Name)
            .IsUnique();
        
        builder.Property(rt => rt.Name)
            .HasMaxLength(20)
            .IsRequired();
    }
}