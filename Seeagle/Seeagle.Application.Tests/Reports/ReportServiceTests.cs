using NSubstitute;
using Seeagle.Application.Common;
using Seeagle.Application.Reports;
using Seeagle.Domain.Reports;

namespace Seeagle.Application.Tests.Reports;

public sealed class ReportServiceTests
{
    [Fact]
    public async Task CreateAsync_ShouldReturnCorrectLatitude_WhenRequestIsValid()
    {
        // Arrange
        var repository = Substitute.For<IRepository<Report>>();
        var service = new ReportService(repository);
        var request = new CreateReportRequest { Latitude = 44.4268, Longitude = 26.1025, Description = "Pothole" };
        
        // Act
        var result = await service.CreateAsync(request, CancellationToken.None);
        
        // Assert
        Assert.Equal(44.4268, result.Latitude);
    }

    [Fact]
    public async Task CreateAsync_ShouldReturnCorrectLongitude_WhenRequestIsValid()
    {
        // Arrange
        var repository = Substitute.For<IRepository<Report>>();
        var service = new ReportService(repository);
        var request = new CreateReportRequest { Latitude = 44.4268, Longitude = 26.1025, Description = "Pothole" };
        
        // Act
        var result = await service.CreateAsync(request, CancellationToken.None);
        
        // Assert
        Assert.Equal(26.1025, result.Longitude);
    }

    [Fact]
    public async Task CreateAsync_ShouldReturnCorrectDescription_WhenRequestIsValid()
    {
        // Arrange
        var repository = Substitute.For<IRepository<Report>>();
        var service = new ReportService(repository);
        var request = new CreateReportRequest { Latitude = 44.4268, Longitude = 26.1025, Description = "Pothole" };
        
        // Act
        var result = await service.CreateAsync(request, CancellationToken.None);
        
        // Assert
        Assert.Equal("Pothole", result.Description);
    }

    [Fact]
    public async Task CreateAsync_ShouldReturnPendingStatus_WhenRequestIsValid()
    {
        // Arrange
        var repository = Substitute.For<IRepository<Report>>();
        var service = new ReportService(repository);
        var request = new CreateReportRequest { Latitude = 44.4268, Longitude = 26.1025, Description = "Pothole" };
        
        // Act
        var result = await service.CreateAsync(request, CancellationToken.None);
        
        // Assert
        Assert.Equal("Pending", result.Status);
    }

    [Fact]
    public async Task CreateAsync_ShouldPersistReport_WhenRequestIsValid()
    {
        // Arrange
        var repository = Substitute.For<IRepository<Report>>();
        var service = new ReportService(repository);
        var request = new CreateReportRequest { Latitude = 44.4268, Longitude = 26.1025, Description = "Pothole" };
        
        // Act
        await service.CreateAsync(request, CancellationToken.None);
        
        // Assert
        await repository.Received(1).AddAsync(Arg.Any<Report>(), CancellationToken.None);
    }

    [Fact]
    public async Task CreateAsync_ShouldSucceed_WhenDescriptionIsNull()
    {
        // Arrange
        var repository = Substitute.For<IRepository<Report>>();
        var service = new ReportService(repository);
        var request = new CreateReportRequest { Latitude = 44.4268, Longitude = 26.1025, Description = null };
        
        // Act
        var result = await service.CreateAsync(request, CancellationToken.None);
        
        // Assert
        Assert.Null(result.Description);
    }

    [Fact]
    public async Task CreateAsync_ShouldThrow_WhenLatitudeIsOutOfRange()
    {
        // Arrange
        var repository = Substitute.For<IRepository<Report>>();
        var service = new ReportService(repository);
        var request = new CreateReportRequest { Latitude = 999, Longitude = 26.1025 };
        
        // Act & Assert
        await Assert.ThrowsAsync<ArgumentOutOfRangeException>(() => service.CreateAsync(request, CancellationToken.None));
    }
}