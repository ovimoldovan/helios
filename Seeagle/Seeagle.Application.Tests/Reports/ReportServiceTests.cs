using Seeagle.Application.Reports;
using Seeagle.Domain.Reports;

namespace Seeagle.Application.Tests.Reports;

public sealed class ReportServiceTests
{
    [Fact]
    public async Task CreateAsync_ShouldPersistAndReturnDto_WhenRequestIsValid()
    {
        // Arrange
        var repository = new InMemoryReportRepository();
        var service = new ReportService(repository);
        var request = new CreateReportRequest 
        { 
            Latitude = 44.4268, 
            Longitude = 26.1025, 
            Description = "Pothole" 
        };

        // Act
        var result = await service.CreateAsync(request, CancellationToken.None);

        // Assert
        Assert.Equal(44.4268, result.Latitude);
        Assert.Equal(26.1025, result.Longitude);
        Assert.Equal("Pothole", result.Description);
        Assert.Equal("Pending", result.Status);
        
        // Let's also verify it actually went into the repository
        var savedReports = await repository.GetAllAsync(CancellationToken.None);
        Assert.Single(savedReports); 
    }

    [Fact]
    public async Task CreateAsync_ShouldSucceed_WhenDescriptionIsNull()
    {
        // Arrange
        var repository = new InMemoryReportRepository();
        var service = new ReportService(repository);
        var request = new CreateReportRequest 
        { 
            Latitude = 44.4268, 
            Longitude = 26.1025, 
            Description = null // Optional!
        };

        // Act
        var result = await service.CreateAsync(request, CancellationToken.None);

        // Assert
        Assert.Null(result.Description);
    }

    [Fact]
    public async Task CreateAsync_ShouldThrow_WhenLatitudeIsOutOfRange()
    {
        // Arrange
        var repository = new InMemoryReportRepository();
        var service = new ReportService(repository);
        var request = new CreateReportRequest 
        { 
            Latitude = 999, // Invalid!
            Longitude = 26.1025 
        };

        // Act & Assert
        // We expect the Domain Entity constructor to throw an ArgumentOutOfRangeException
        await Assert.ThrowsAsync<ArgumentOutOfRangeException>(() => 
            service.CreateAsync(request, CancellationToken.None));
    }
}