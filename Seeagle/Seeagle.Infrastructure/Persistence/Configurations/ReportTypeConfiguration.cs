using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Seeagle.Domain.ReportTypes;

namespace Seeagle.Infrastructure.Persistence.Configurations;

public sealed class ReportTypeConfiguration : IEntityTypeConfiguration<ReportType>
{
    public void Configure(EntityTypeBuilder<ReportType> builder)
    {
        builder.ToTable("ReportTypes");

        builder.HasKey(rt => rt.Id);

        builder.Property(rt => rt.Name)
            .IsRequired()
            .HasMaxLength(100);
    }
}