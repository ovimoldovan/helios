using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Seeagle.Domain.Reports;

namespace Seeagle.Infrastructure.Persistence.Configurations;

public sealed class ReportConfiguration : IEntityTypeConfiguration<Report>
{
    public void Configure(EntityTypeBuilder<Report> builder)
    {
        builder.HasKey(r => r.Id);

        builder.Property(r => r.Location)
            .HasColumnType("geometry")
            .IsRequired();

        builder.Property(r => r.Description)
            .HasMaxLength(255);

        builder.Property(r => r.Status)
            .HasConversion<string>()
            .IsRequired();

        builder.HasOne(r => r.User)
            .WithMany()
            .IsRequired()
            .OnDelete(DeleteBehavior.Restrict);
        
        builder.HasMany(r => r.DuplicateCandidates)
            .WithMany()
            .UsingEntity<Dictionary<string, object>>(
                "ReportDuplicateCandidates",
                right => right
                    .HasOne<Report>()
                    .WithMany()
                    .HasForeignKey("DuplicateCandidateId")
                    .OnDelete(DeleteBehavior.Restrict),
                left => left
                    .HasOne<Report>()
                    .WithMany()
                    .HasForeignKey("ReportId")
                    .OnDelete(DeleteBehavior.Restrict),
                join =>
                {
                    join.HasKey("ReportId", "DuplicateCandidateId");
                });
    }
}