using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Seeagle.Domain.User;

namespace Seeagle.Infrastructure.Persistence.Configurations;

public class RefreshTokenConfiguration : IEntityTypeConfiguration<RefreshToken>
{
    public void Configure(EntityTypeBuilder<RefreshToken> builder)
    {
        builder.HasKey(refreshToken => refreshToken.Id);

        builder.Property(refreshToken => refreshToken.Token)
            .IsRequired();

        builder.HasOne(refreshToken => refreshToken.User)
            .WithMany()
            .IsRequired()
            .OnDelete(DeleteBehavior.Cascade);

        builder.Property(refreshToken => refreshToken.CreatedUtc)
            .IsRequired();

        builder.Property(refreshToken => refreshToken.Expires)
            .IsRequired();

        builder.Property(refreshToken => refreshToken.KeepMeLoggedIn)
            .IsRequired();
    }
}