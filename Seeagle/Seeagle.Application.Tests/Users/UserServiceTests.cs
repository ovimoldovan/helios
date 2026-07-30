using Microsoft.AspNetCore.Identity;
using MockQueryable;
using NSubstitute;
using Seeagle.Application.Users;
using Seeagle.Application.Common;
using Seeagle.Domain.User;

namespace Seeagle.Application.Tests.Users;

public sealed class UserServiceTests
{
    private readonly PasswordHasher<User> _passwordHasher = new();

    [Fact]
    public async Task RegisterUserAsync_ShouldReturnDtoWithUserData_WhenDataIsValid()
    {
        // Arrange
        var repository = Substitute.For<IRepository<User>>();
        repository.GetAllQueryable().Returns(new List<User>().BuildMock());
        var service = new UserService(repository);
        var request = new RegisterUserRequest
        {
            Email = "test@test.com",
            Password = "Parola123!",
            FirstName = "Ana",
            LastName = "Popescu"
        };

        // Act
        var result = await service.RegisterUserAsync(request, CancellationToken.None);

        // Assert
        Assert.Equal("test@test.com", result.Email);
        Assert.Equal("Ana", result.FirstName);
        Assert.Equal("Popescu", result.LastName);
    }

    [Fact]
    public async Task RegisterUserAsync_ShouldPersistUser_WhenDataIsValid()
    {
        // Arrange
        var repository = Substitute.For<IRepository<User>>();
        repository.GetAllQueryable().Returns(new List<User>().BuildMock());
        var service = new UserService(repository);
        var request = new RegisterUserRequest
        {
            Email = "test@test.com",
            Password = "Parola123!",
            FirstName = "Ana",
            LastName = "Popescu"
        };

        // Act
        await service.RegisterUserAsync(request, CancellationToken.None);

        // Assert
        await repository.Received(1)
            .AddAsync(Arg.Is<User>(user => user.Email == "test@test.com"), CancellationToken.None);
    }

    [Fact]
    public async Task RegisterUserAsync_ShouldReturnNormalizedEmail_WhenEmailHasSurroundingWhitespaceAndUppercase()
    {
        // Arrange
        var repository = Substitute.For<IRepository<User>>();
        repository.GetAllQueryable().Returns(new List<User>().BuildMock());
        var service = new UserService(repository);
        var request = new RegisterUserRequest
        {
            Email = "  Test@TEST.com  ",
            Password = "Parola123!",
            FirstName = "Ana",
            LastName = "Popescu"
        };

        // Act
        var result = await service.RegisterUserAsync(request, CancellationToken.None);

        // Assert
        Assert.Equal("test@test.com", result.Email);
    }

    [Fact]
    public async Task RegisterUserAsync_ShouldThrowInvalidOperationException_WhenEmailAlreadyExists()
    {
        // Arrange
        var repository = Substitute.For<IRepository<User>>();
        var existingUser = new User("test@test.com", "somehash", "Maria", "Ionescu");
        repository.GetAllQueryable().Returns(new List<User> { existingUser }.BuildMock());
        var service = new UserService(repository);
        var request = new RegisterUserRequest
        {
            Email = "test@test.com",
            Password = "Parola123!",
            FirstName = "Ana",
            LastName = "Popescu"
        };

        // Act & Assert
        await Assert.ThrowsAsync<InvalidOperationException>(() =>
            service.RegisterUserAsync(request, CancellationToken.None));
    }

    [Fact]
    public async Task RegisterUserAsync_ShouldNotPersistUser_WhenEmailAlreadyExists()
    {
        // Arrange
        var repository = Substitute.For<IRepository<User>>();
        var existingUser = new User("test@test.com", "somehash", "Maria", "Ionescu");
        repository.GetAllQueryable().Returns(new List<User> { existingUser }.BuildMock());
        var service = new UserService(repository);
        var request = new RegisterUserRequest
        {
            Email = "test@test.com",
            Password = "Parola123!",
            FirstName = "Ana",
            LastName = "Popescu"
        };

        // Act
        try
        {
            await service.RegisterUserAsync(request, CancellationToken.None);
        }
        catch (InvalidOperationException)
        {
            // expected
        }

        // Assert
        await repository.DidNotReceive().AddAsync(Arg.Any<User>(), Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task ValidateCredentialsAsync_ShouldReturnUser_WhenCredentialsAreValid()
    {
        // Arrange
        var placeholderUser = new User("test@test.com", "placeholder", "Ana", "Popescu");
        var existingUser = new User(placeholderUser.Email, _passwordHasher.HashPassword(placeholderUser, "Parola123!"),
            placeholderUser.FirstName, placeholderUser.LastName);

        var repository = Substitute.For<IRepository<User>>();
        repository.GetAllQueryable().Returns(new List<User> { existingUser }.BuildMock());
        var service = new UserService(repository);

        var request = new LoginUserRequest
        {
            Email = "test@test.com",
            Password = "Parola123!"
        };

        // Act
        var result = await service.ValidateCredentialsAsync(request, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("test@test.com", result!.Email);
    }

    [Fact]
    public async Task ValidateCredentialsAsync_ShouldReturnNull_WhenEmailDoesNotExist()
    {
        // Arrange
        var repository = Substitute.For<IRepository<User>>();
        repository.GetAllQueryable().Returns(new List<User>().BuildMock());
        var service = new UserService(repository);

        var request = new LoginUserRequest
        {
            Email = "nonexistent@test.com",
            Password = "Parola123!"
        };

        // Act
        var result = await service.ValidateCredentialsAsync(request, CancellationToken.None);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task ValidateCredentialsAsync_ShouldReturnNull_WhenPasswordIsIncorrect()
    {
        // Arrange
        var placeholderUser = new User("test@test.com", "placeholder", "Ana", "Popescu");
        var existingUser = new User(
            placeholderUser.Email,
            _passwordHasher.HashPassword(placeholderUser, "Parola123!"),
            placeholderUser.FirstName,
            placeholderUser.LastName);

        var repository = Substitute.For<IRepository<User>>();
        repository.GetAllQueryable().Returns(new List<User> { existingUser }.BuildMock());
        var service = new UserService(repository);

        var request = new LoginUserRequest
        {
            Email = "test@test.com",
            Password = "WrongPassword!"
        };

        // Act
        var result = await service.ValidateCredentialsAsync(request, CancellationToken.None);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task ValidateCredentialsAsync_ShouldReturnUser_WhenEmailHasSurroundingWhitespaceAndUppercase()
    {
        // Arrange
        var placeholderUser = new User("test@test.com", "placeholder", "Ana", "Popescu");
        var existingUser = new User(
            placeholderUser.Email,
            _passwordHasher.HashPassword(placeholderUser, "Parola123!"),
            placeholderUser.FirstName,
            placeholderUser.LastName);

        var repository = Substitute.For<IRepository<User>>();
        repository.GetAllQueryable().Returns(new List<User> { existingUser }.BuildMock());
        var service = new UserService(repository);

        var request = new LoginUserRequest
        {
            Email = "  Test@TEST.com  ",
            Password = "Parola123!"
        };

        // Act
        var result = await service.ValidateCredentialsAsync(request, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("test@test.com", result!.Email);
    }
}