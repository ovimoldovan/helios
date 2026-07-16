using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Seeagle.Domain.SampleNames;

namespace Seeagle.Infrastructure.Persistence.Configurations;

public sealed class SampleNameConfiguration : IEntityTypeConfiguration<SampleName>
{
    public void Configure(EntityTypeBuilder<SampleName> builder)
    {
        builder.ToTable("sample_names");

        builder.HasKey(sampleName => sampleName.Id);

        builder.Property(sampleName => sampleName.Name)
            .HasMaxLength(10)
            .IsRequired();

        builder.Property(sampleName => sampleName.CreatedUtc)
            .IsRequired();
    }
}
