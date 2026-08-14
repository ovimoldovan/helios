using NSubstitute;
using Seeagle.Application.Common;
using Seeagle.Application.Reports;
using Seeagle.Domain.Reports;
using Seeagle.Domain.User;

namespace Seeagle.Application.Tests.Reports;

public sealed class ReportServiceTests
{
    [Fact]
    public async Task CreateAsync_ShouldReturnCorrectLatitude_WhenRequestIsValid()
    {
        // Arrange
        var reportRepository = Substitute.For<IRepository<Report>>();
        var userRepository = Substitute.For<IRepository<User>>();
        
        var user = new User("test@test.com", "password", "firstname", "lastname");
        userRepository.GetAllQueryable().Returns(new List<User> { user }.AsQueryable());
        
        var service = new ReportService(reportRepository, userRepository);
        var request = new CreateReportRequest { Latitude = 44.4268, Longitude = 26.1025, Description = "Pothole" };
        
        // Act
        var result = await service.CreateAsync(user.Id, request, CancellationToken.None);
        
        // Assert
        Assert.Equal(44.4268, result.Latitude);
    }

    [Fact]
    public async Task CreateAsync_ShouldReturnCorrectLongitude_WhenRequestIsValid()
    {
        // Arrange
        var reportRepository = Substitute.For<IRepository<Report>>();
        var userRepository = Substitute.For<IRepository<User>>();
        
        var user = new User("test@test.com", "password", "firstname", "lastname");
        userRepository.GetAllQueryable().Returns(new List<User> { user }.AsQueryable());
        
        var service = new ReportService(reportRepository, userRepository);
        var request = new CreateReportRequest { Latitude = 44.4268, Longitude = 26.1025, Description = "Pothole" };
        
        // Act
        var result = await service.CreateAsync(user.Id, request, CancellationToken.None);
        
        // Assert
        Assert.Equal(26.1025, result.Longitude);
    }

    [Fact]
    public async Task CreateAsync_ShouldReturnCorrectDescription_WhenRequestIsValid()
    {
        // Arrange
        var reportRepository = Substitute.For<IRepository<Report>>();
        var userRepository = Substitute.For<IRepository<User>>();
        
        var user = new User("test@test.com", "password", "firstname", "lastname");
        userRepository.GetAllQueryable().Returns(new List<User> { user }.AsQueryable());
        
        var service = new ReportService(reportRepository, userRepository);
        var request = new CreateReportRequest { Latitude = 44.4268, Longitude = 26.1025, Description = "Pothole" };
        
        // Act
        var result = await service.CreateAsync(user.Id, request, CancellationToken.None);
        
        // Assert
        Assert.Equal("Pothole", result.Description);
    }

    [Fact]
    public async Task CreateAsync_ShouldReturnPendingStatus_WhenRequestIsValid()
    {
        // Arrange
        var reportRepository = Substitute.For<IRepository<Report>>();
        var userRepository = Substitute.For<IRepository<User>>();
        
        var user = new User("test@test.com", "password", "firstname", "lastname");
        userRepository.GetAllQueryable().Returns(new List<User> { user }.AsQueryable());
        
        var service = new ReportService(reportRepository, userRepository);
        var request = new CreateReportRequest { Latitude = 44.4268, Longitude = 26.1025, Description = "Pothole" };
        
        // Act
        var result = await service.CreateAsync(user.Id, request, CancellationToken.None);
        
        // Assert
        Assert.Equal("Pending", result.Status);
    }

    [Fact]
    public async Task CreateAsync_ShouldPersistReport_WhenRequestIsValid()
    {
        // Arrange
        var reportRepository = Substitute.For<IRepository<Report>>();
        var userRepository = Substitute.For<IRepository<User>>();
        
        var user = new User("test@test.com", "password", "firstname", "lastname");
        userRepository.GetAllQueryable().Returns(new List<User> { user }.AsQueryable());
        
        var service = new ReportService(reportRepository, userRepository);
        var request = new CreateReportRequest { Latitude = 44.4268, Longitude = 26.1025, Description = "Pothole" };
        
        // Act
        await service.CreateAsync(user.Id, request, CancellationToken.None);
        
        // Assert
        await reportRepository.Received(1).AddAsync(Arg.Any<Report>(), CancellationToken.None);
    }

    [Fact]
    public async Task CreateAsync_ShouldSucceed_WhenDescriptionIsNull()
    {
        // Arrange
        var reportRepository = Substitute.For<IRepository<Report>>();
        var userRepository = Substitute.For<IRepository<User>>();
        
        var user = new User("test@test.com", "password", "firstname", "lastname");
        userRepository.GetAllQueryable().Returns(new List<User> { user }.AsQueryable());
        
        var service = new ReportService(reportRepository, userRepository);
        var request = new CreateReportRequest { Latitude = 44.4268, Longitude = 26.1025, Description = null };
        
        // Act
        var result = await service.CreateAsync(user.Id, request, CancellationToken.None);
        
        // Assert
        Assert.Null(result.Description);
    }

    [Fact]
    public async Task CreateAsync_ShouldThrow_WhenLatitudeIsOutOfRange()
    {
        // Arrange
        var reportRepository = Substitute.For<IRepository<Report>>();
        var userRepository = Substitute.For<IRepository<User>>();
        
        var user = new User("test@test.com", "password", "firstname", "lastname");
        userRepository.GetAllQueryable().Returns(new List<User> { user }.AsQueryable());
        
        var service = new ReportService(reportRepository, userRepository);
        var request = new CreateReportRequest { Latitude = 999, Longitude = 26.1025 };
        
        // Act & Assert
        await Assert.ThrowsAsync<ArgumentOutOfRangeException>(() => service.CreateAsync(user.Id, request, CancellationToken.None));
    }
}