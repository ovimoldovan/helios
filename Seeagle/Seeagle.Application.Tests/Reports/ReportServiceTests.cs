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
    
    [Fact]
    public async Task GetPendingAsync_ShouldReturnOnlyPendingReports()
    {
        // Arrange
        var repository = Substitute.For<IRepository<Report>>();
        var service = new ReportService(repository);

        var pendingReport = new Report(44.4268, 26.1025, "Pending report");
        var approvedReport = new Report(44.4268, 26.1025, "Approved report");
        approvedReport.Approve();

        repository
            .GetAllAsync(CancellationToken.None)
            .Returns(new List<Report> { pendingReport, approvedReport });

        // Act
        var result = await service.GetPendingAsync(CancellationToken.None);

        // Assert
        Assert.Single(result);
        Assert.Equal("Pending", result[0].Status);
    }
    
    [Fact]
    public async Task ApproveAsync_ShouldChangeStatusToApproved_WhenReportExists()
    {
        // Arrange
        var repository = Substitute.For<IRepository<Report>>();
        var service = new ReportService(repository);

        var report = new Report(44.4268, 26.1025, "Pothole");

        repository
            .GetAllQueryable()
            .Returns(new List<Report> { report }.AsQueryable());

        // Act
        var result = await service.ApproveAsync(report.Id, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Approved", result.Status);
        await repository.Received(1).UpdateAsync(report, CancellationToken.None);
    }
    
    [Fact]
    public async Task RejectAsync_ShouldChangeStatusToRejected_WhenReportExists()
    {
        // Arrange
        var repository = Substitute.For<IRepository<Report>>();
        var service = new ReportService(repository);

        var report = new Report(44.4268, 26.1025, "Pothole");

        repository
            .GetAllQueryable()
            .Returns(new List<Report> { report }.AsQueryable());

        // Act
        var result = await service.RejectAsync(report.Id, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Rejected", result.Status);
        await repository.Received(1).UpdateAsync(report, CancellationToken.None);
    }

    [Fact]
    public async Task GetPendingAsync_ShouldReturnEmptyList_WhenNoPendingReportsExist()
    {
        // Arrange
        var repository = Substitute.For<IRepository<Report>>();
        var service = new ReportService(repository);

        var approvedReport = new Report(44.4268, 26.1025, "Approved report");
        approvedReport.Approve();

        var rejectedReport = new Report(44.4268, 26.1025, "Rejected report");
        rejectedReport.Reject();

        repository
            .GetAllAsync(CancellationToken.None)
            .Returns(new List<Report> { approvedReport, rejectedReport });

        // Act
        var result = await service.GetPendingAsync(CancellationToken.None);

        // Assert
        Assert.Empty(result);
    }
    
    [Fact]
    public async Task ApproveAsync_ShouldReturnNull_WhenReportDoesNotExist()
    {
        // Arrange
        var repository = Substitute.For<IRepository<Report>>();
        var service = new ReportService(repository);

        repository
            .GetAllQueryable()
            .Returns(new List<Report>().AsQueryable());

        // Act
        var result = await service.ApproveAsync(Guid.NewGuid(), CancellationToken.None);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task RejectAsync_ShouldReturnNull_WhenReportDoesNotExist()
    {
        // Arrange
        var repository = Substitute.For<IRepository<Report>>();
        var service = new ReportService(repository);

        repository
            .GetAllQueryable()
            .Returns(new List<Report>().AsQueryable());

        // Act
        var result = await service.RejectAsync(Guid.NewGuid(), CancellationToken.None);

        // Assert
        Assert.Null(result);
    }
}