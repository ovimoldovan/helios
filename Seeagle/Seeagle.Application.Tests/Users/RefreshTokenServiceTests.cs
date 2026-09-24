using MockQueryable;
using NSubstitute;
using Seeagle.Application.Common;
using Seeagle.Application.Users;
using Seeagle.Domain.User;

namespace Seeagle.Application.Tests.Users;

public sealed class RefreshTokenServiceTests
{
    [Fact]
    public async Task CreateAsync_ShouldReturnTokenForUser_WhenCalled()
    {
        // Arrange
        var repository = Substitute.For<IRepository<RefreshToken>>();
        var user = new User("test@test.com", "placeholder", "Ana", "Popescu");
        var service = new RefreshTokenService(repository);

        // Act
        var result = await service.CreateAsync(user, 7, true, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(user.Id, result.User.Id);
        Assert.True(result.KeepMeLoggedIn);
    }

    [Fact]
    public async Task CreateAsync_ShouldPersistToken_WhenCalled()
    {
        // Arrange
        var repository = Substitute.For<IRepository<RefreshToken>>();
        var user = new User("test@test.com", "placeholder", "Ana", "Popescu");
        var service = new RefreshTokenService(repository);

        // Act
        await service.CreateAsync(user, 7, false, CancellationToken.None);

        // Assert
        await repository.Received(1)
            .AddAsync(Arg.Is<RefreshToken>(token => token!.User.Id == user.Id && !token.KeepMeLoggedIn), CancellationToken.None);
    }

    [Fact]
    public async Task GetByTokenAsync_ShouldReturnToken_WhenTokenExists()
    {
        // Arrange
        var repository = Substitute.For<IRepository<RefreshToken>>();
        var user = new User("test@test.com", "placeholder", "Ana", "Popescu");
        var refreshToken = new RefreshToken(user, 7, false);
        repository.GetAllQueryable().Returns(new List<RefreshToken> { refreshToken }.BuildMock());
        var service = new RefreshTokenService(repository);

        // Act
        var result = await service.GetByTokenAsync(refreshToken.Token, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(refreshToken.Token, result.Token);
    }

    [Fact]
    public async Task GetByTokenAsync_ShouldReturnNull_WhenTokenDoesNotExist()
    {
        // Arrange
        var repository = Substitute.For<IRepository<RefreshToken>>();
        var user = new User("test@test.com", "placeholder", "Ana", "Popescu");
        var refreshToken = new RefreshToken(user, 7, false);
        repository.GetAllQueryable().Returns(new List<RefreshToken> { refreshToken }.BuildMock());
        var service = new RefreshTokenService(repository);

        // Act
        var result = await service.GetByTokenAsync("nonexistent-token", CancellationToken.None);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task RevokeExistingAsync_ShouldSetRevokedTimestamp_WhenTokenExists()
    {
        // Arrange
        var repository = Substitute.For<IRepository<RefreshToken>>();
        var user = new User("test@test.com", "placeholder", "Ana", "Popescu");
        var refreshToken = new RefreshToken(user, 7, false);
        repository.GetAllQueryable().Returns(new List<RefreshToken> { refreshToken }.BuildMock());
        var service = new RefreshTokenService(repository);

        // Act
        await service.RevokeExistingAsync(refreshToken.Token, CancellationToken.None);

        // Assert
        Assert.NotNull(refreshToken.Revoked);
    }

    [Fact]
    public async Task RevokeExistingAsync_ShouldPersistChange_WhenTokenExists()
    {
        // Arrange
        var repository = Substitute.For<IRepository<RefreshToken>>();
        var user = new User("test@test.com", "placeholder", "Ana", "Popescu");
        var refreshToken = new RefreshToken(user, 7, false);
        repository.GetAllQueryable().Returns(new List<RefreshToken> { refreshToken }.BuildMock());
        var service = new RefreshTokenService(repository);

        // Act
        await service.RevokeExistingAsync(refreshToken.Token, CancellationToken.None);

        // Assert
        await repository.Received(1)
            .UpdateAsync(Arg.Is<RefreshToken>(token => token!.Token == refreshToken.Token), CancellationToken.None);
    }

    [Fact]
    public async Task RevokeExistingAsync_ShouldNotThrowOrPersist_WhenTokenDoesNotExist()
    {
        // Arrange
        var repository = Substitute.For<IRepository<RefreshToken>>();
        repository.GetAllQueryable().Returns(new List<RefreshToken>().BuildMock());
        var service = new RefreshTokenService(repository);

        // Act
        await service.RevokeExistingAsync("nonexistent-token", CancellationToken.None);

        // Assert
        await repository.DidNotReceive().UpdateAsync(Arg.Any<RefreshToken>(), Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task RevokeAllActiveForUserAsync_ShouldRevokeAllTokensForUser_WhenUserHasMultipleTokens()
    {
        // Arrange
        var repository = Substitute.For<IRepository<RefreshToken>>();
        var user = new User("test@test.com", "placeholder", "Ana", "Popescu");
        var tokenOne = new RefreshToken(user, 7, false);
        var tokenTwo = new RefreshToken(user, 7, false);
        repository.GetAllQueryable().Returns(new List<RefreshToken> { tokenOne, tokenTwo }.BuildMock());
        var service = new RefreshTokenService(repository);

        // Act
        await service.RevokeAllActiveForUserAsync(user.Id, CancellationToken.None);

        // Assert
        Assert.NotNull(tokenOne.Revoked);
        Assert.NotNull(tokenTwo.Revoked);
    }

    [Fact]
    public async Task RevokeAllActiveForUserAsync_ShouldNotRevokeTokensForOtherUsers_WhenCalled()
    {
        // Arrange
        var repository = Substitute.For<IRepository<RefreshToken>>();
        var targetUser = new User("test@test.com", "placeholder", "Ana", "Popescu");
        var otherUser = new User("other@test.com", "placeholder", "Maria", "Ionescu");
        var targetToken = new RefreshToken(targetUser, 7, false);
        var otherToken = new RefreshToken(otherUser, 7, false);
        repository.GetAllQueryable().Returns(new List<RefreshToken> { targetToken, otherToken }.BuildMock());
        var service = new RefreshTokenService(repository);

        // Act
        await service.RevokeAllActiveForUserAsync(targetUser.Id, CancellationToken.None);

        // Assert
        Assert.NotNull(targetToken.Revoked);
        Assert.Null(otherToken.Revoked);
    }

    [Fact]
    public async Task RevokeAllActiveForUserAsync_ShouldPersistEachRevokedToken_WhenUserHasTokens()
    {
        // Arrange
        var repository = Substitute.For<IRepository<RefreshToken>>();
        var user = new User("test@test.com", "placeholder", "Ana", "Popescu");
        var tokenOne = new RefreshToken(user, 7, false);
        var tokenTwo = new RefreshToken(user, 7, false);
        repository.GetAllQueryable().Returns(new List<RefreshToken> { tokenOne, tokenTwo }.BuildMock());
        var service = new RefreshTokenService(repository);

        // Act
        await service.RevokeAllActiveForUserAsync(user.Id, CancellationToken.None);

        // Assert
        await repository.Received(2).UpdateAsync(Arg.Any<RefreshToken>(), CancellationToken.None);
    }

    [Fact]
    public async Task RevokeAllActiveForUserAsync_ShouldNotThrowOrPersist_WhenUserHasNoTokens()
    {
        // Arrange
        var repository = Substitute.For<IRepository<RefreshToken>>();
        repository.GetAllQueryable().Returns(new List<RefreshToken>().BuildMock());
        var service = new RefreshTokenService(repository);

        // Act
        await service.RevokeAllActiveForUserAsync(Guid.NewGuid(), CancellationToken.None);

        // Assert
        await repository.DidNotReceive().UpdateAsync(Arg.Any<RefreshToken>(), Arg.Any<CancellationToken>());
    }
}