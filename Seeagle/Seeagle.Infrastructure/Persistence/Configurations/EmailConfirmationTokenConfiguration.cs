using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Seeagle.Domain.User;

namespace Seeagle.Infrastructure.Persistence.Configurations;

public class EmailConfirmationTokenConfiguration : IEntityTypeConfiguration<EmailConfirmationToken>
{
    public void Configure(EntityTypeBuilder<EmailConfirmationToken> builder)
    {
        builder.HasOne(token => token.User)
            .WithOne()
            .HasForeignKey<EmailConfirmationToken>("UserId")
            .IsRequired()
            .OnDelete(DeleteBehavior.Cascade);
        
        builder.HasIndex("UserId").IsUnique();
    }
}