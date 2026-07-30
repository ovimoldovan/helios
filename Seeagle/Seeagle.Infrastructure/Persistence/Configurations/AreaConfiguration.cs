using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Seeagle.Domain.Area;

namespace Seeagle.Infrastructure.Persistence.Configurations;
public sealed class AreaConfiguration : IEntityTypeConfiguration<Area>
{
    public void Configure(EntityTypeBuilder<Area> builder)
    {
        builder.ToTable("Areas");

        builder.HasKey(a => a.Id);

        builder.Property(a => a.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder.OwnsOne(a => a.Location, location =>
        {
            location.Property(l => l.Latitude)
                .IsRequired();

            location.Property(l => l.Longitude)
                .IsRequired();
        });
    }
}