using Seeagle.Application.Reports;
using Seeagle.Domain.Reports;

namespace Seeagle.Application.Tests.Reports;

public sealed class ReportServiceTests
{
    [Fact]
    public async Task CreateAsync_ShouldReturnCorrectLatitude_WhenRequestIsValid()
    {
        
        var repository = new InMemoryReportRepository();
        var service = new ReportService(repository);
        var request = new CreateReportRequest
        {
            Latitude = 44.4268,
            Longitude = 26.1025,
            Description = "Pothole"
        };

        
        var result = await service.CreateAsync(request, CancellationToken.None);

        
        Assert.Equal(44.4268, result.Latitude);
    }

    [Fact]
    public async Task CreateAsync_ShouldReturnCorrectLongitude_WhenRequestIsValid()
    {
        
        var repository = new InMemoryReportRepository();
        var service = new ReportService(repository);
        var request = new CreateReportRequest
        {
            Latitude = 44.4268,
            Longitude = 26.1025,
            Description = "Pothole"
        };

        
        var result = await service.CreateAsync(request, CancellationToken.None);

        
        Assert.Equal(26.1025, result.Longitude);
    }

    [Fact]
    public async Task CreateAsync_ShouldReturnCorrectDescription_WhenRequestIsValid()
    {
       
        var repository = new InMemoryReportRepository();
        var service = new ReportService(repository);
        var request = new CreateReportRequest
        {
            Latitude = 44.4268,
            Longitude = 26.1025,
            Description = "Pothole"
        };

   
        var result = await service.CreateAsync(request, CancellationToken.None);

        Assert.Equal("Pothole", result.Description);
    }

    [Fact]
    public async Task CreateAsync_ShouldReturnPendingStatus_WhenRequestIsValid()
    {

        var repository = new InMemoryReportRepository();
        var service = new ReportService(repository);
        var request = new CreateReportRequest
        {
            Latitude = 44.4268,
            Longitude = 26.1025,
            Description = "Pothole"
        };

        var result = await service.CreateAsync(request, CancellationToken.None);

       
        Assert.Equal("Pending", result.Status);
    }

    [Fact]
    public async Task CreateAsync_ShouldPersistReport_WhenRequestIsValid()
    {
      
        var repository = new InMemoryReportRepository();
        var service = new ReportService(repository);
        var request = new CreateReportRequest
        {
            Latitude = 44.4268,
            Longitude = 26.1025,
            Description = "Pothole"
        };

       
        await service.CreateAsync(request, CancellationToken.None);

       
        var savedReports = await repository.GetAllAsync(CancellationToken.None);
        Assert.Single(savedReports);
    }

    [Fact]
    public async Task CreateAsync_ShouldSucceed_WhenDescriptionIsNull()
    {
        
        var repository = new InMemoryReportRepository();
        var service = new ReportService(repository);
        var request = new CreateReportRequest
        {
            Latitude = 44.4268,
            Longitude = 26.1025,
            Description = null
        };

        
        var result = await service.CreateAsync(request, CancellationToken.None);

        
        Assert.Null(result.Description);
    }

    [Fact]
    public async Task CreateAsync_ShouldThrow_WhenLatitudeIsOutOfRange()
    {
        
        var repository = new InMemoryReportRepository();
        var service = new ReportService(repository);
        var request = new CreateReportRequest
        {
            Latitude = 999,
            Longitude = 26.1025
        };

        
        await Assert.ThrowsAsync<ArgumentOutOfRangeException>(() =>
            service.CreateAsync(request, CancellationToken.None));
    }
}