using NetTopologySuite.Geometries;
using NSubstitute;
using Seeagle.Application.Common;
using Seeagle.Application.Reports;
using Seeagle.Domain.Reports;
using Seeagle.Domain.User;
using Seeagle.Domain.Areas;
using MockQueryable;

namespace Seeagle.Application.Tests.Reports;

public sealed class ReportServiceTests
{
    [Fact]
    public async Task CreateAsync_ShouldReturnPendingStatus_WhenRequestIsValid()
    {
        // Arrange
        var reportRepository = Substitute.For<IRepository<Report>>();
        var userRepository = Substitute.For<IRepository<User>>();
        var areaRepository = Substitute.For<IRepository<Area>>();
        var reportTypeRepository = Substitute.For<IRepository<ReportType>>();
        var photoProcessor = Substitute.For<IPhotoProcessor>();

        var user = new User("test@test.com", "password", "firstname", "lastname");
        userRepository.GetAllQueryable().Returns(new List<User> { user }.AsQueryable());

        var reportType = new ReportType("ReportType");
        reportTypeRepository.GetAllQueryable().Returns(new List<ReportType> { reportType }.AsQueryable());

        var service = new ReportService(reportRepository, userRepository, areaRepository, reportTypeRepository, photoProcessor);
        var request = new CreateReportRequest
        {
            Latitude = 44.4268,
            Longitude = 26.1025,
            Description = "Pothole",
            ReportTypeId = reportType.Id
        };

        // Act
        var result = await service.CreateAsync(
            user.Id,
            request,
            CancellationToken.None);

        // Assert
        Assert.Equal("Pending", result.Status);
    }

    [Fact]
    public async Task CreateAsync_ShouldPersistReport_WhenRequestIsValid()
    {
        // Arrange
        var reportRepository = Substitute.For<IRepository<Report>>();
        var userRepository = Substitute.For<IRepository<User>>();
        var areaRepository = Substitute.For<IRepository<Area>>();
        var reportTypeRepository = Substitute.For<IRepository<ReportType>>();
        var photoProcessor = Substitute.For<IPhotoProcessor>();

        var user = new User("test@test.com", "password", "firstname", "lastname");
        userRepository.GetAllQueryable().Returns(new List<User> { user }.AsQueryable());
        
        var reportType = new ReportType("ReportType");
        reportTypeRepository.GetAllQueryable().Returns(new List<ReportType> { reportType }.AsQueryable());

        var service = new ReportService(reportRepository, userRepository, areaRepository, reportTypeRepository, photoProcessor);
        var request = new CreateReportRequest
        {
            Latitude = 44.4268,
            Longitude = 26.1025,
            Description = "Pothole",
            ReportTypeId = reportType.Id
        };

        // Act
        await service.CreateAsync(
            user.Id,
            request,
            CancellationToken.None);

        // Assert
        await reportRepository
            .Received(1)
            .AddAsync(
                Arg.Any<Report>(),
                CancellationToken.None);
    }

    [Fact]
    public async Task CreateAsync_ShouldSucceed_WhenDescriptionIsNull()
    {
        // Arrange
        var reportRepository = Substitute.For<IRepository<Report>>();
        var userRepository = Substitute.For<IRepository<User>>();
        var areaRepository = Substitute.For<IRepository<Area>>();
        var reportTypeRepository = Substitute.For<IRepository<ReportType>>();
        var photoProcessor = Substitute.For<IPhotoProcessor>();

        var user = new User("test@test.com", "password", "firstname", "lastname");
        userRepository.GetAllQueryable().Returns(new List<User> { user }.AsQueryable());
        
        var reportType = new ReportType("ReportType");
        reportTypeRepository.GetAllQueryable().Returns(new List<ReportType> { reportType }.AsQueryable());

        var service = new ReportService(reportRepository, userRepository, areaRepository, reportTypeRepository, photoProcessor);
        var request = new CreateReportRequest
        {
            Latitude = 44.4268,
            Longitude = 26.1025,
            Description = null,
            ReportTypeId = reportType.Id
        };

        // Act
        var result = await service.CreateAsync(
            user.Id,
            request,
            CancellationToken.None);

        // Assert
        Assert.Null(result.Description);
    }

    [Fact]
    public async Task CreateAsync_ShouldThrow_WhenLatitudeIsOutOfRange()
    {
        // Arrange
        var reportRepository = Substitute.For<IRepository<Report>>();
        var userRepository = Substitute.For<IRepository<User>>();
        var areaRepository = Substitute.For<IRepository<Area>>();
        var reportTypeRepository = Substitute.For<IRepository<ReportType>>();
        var photoProcessor = Substitute.For<IPhotoProcessor>();

        var user = new User("test@test.com", "password", "firstname", "lastname");
        userRepository.GetAllQueryable().Returns(new List<User> { user }.AsQueryable());
        
        var reportType = new ReportType("ReportType");
        reportTypeRepository.GetAllQueryable().Returns(new List<ReportType> { reportType }.AsQueryable());

        var service = new ReportService(reportRepository, userRepository, areaRepository, reportTypeRepository, photoProcessor);
        var request = new CreateReportRequest
        {
            Latitude = 999,
            Longitude = 26.1025,
            ReportTypeId = reportType.Id
        };

        // Act & Assert
        await Assert.ThrowsAsync<ArgumentOutOfRangeException>(() => service.CreateAsync(
            user.Id,
            request,
            CancellationToken.None));
    }
    
    [Fact]
    public async Task CreateAsync_ShouldThrow_WhenUserDoesNotExist()
    {
        // Arrange
        var reportRepository = Substitute.For<IRepository<Report>>();
        var userRepository = Substitute.For<IRepository<User>>();
        var areaRepository = Substitute.For<IRepository<Area>>();
        var reportTypeRepository = Substitute.For<IRepository<ReportType>>();
        var photoProcessor = Substitute.For<IPhotoProcessor>();

        userRepository.GetAllQueryable().Returns(new List<User>().AsQueryable());

        var reportType = new ReportType("ReportType");
        reportTypeRepository.GetAllQueryable().Returns(new List<ReportType> { reportType }.AsQueryable());

        var service = new ReportService(reportRepository, userRepository, areaRepository, reportTypeRepository, photoProcessor);
        var request = new CreateReportRequest
        {
            Latitude = 44.4268,
            Longitude = 26.1025,
            Description = "Pothole",
            ReportTypeId = reportType.Id
        };

        // Act & Assert
        await Assert.ThrowsAsync<InvalidOperationException>(() => service.CreateAsync(
            Guid.NewGuid(),
            request,
            CancellationToken.None));
    }

    [Fact]
    public async Task CreateAsync_ShouldThrow_WhenReportTypeDoesntExist()
    {
        // Arrange
        var reportRepository = Substitute.For<IRepository<Report>>();
        var userRepository = Substitute.For<IRepository<User>>();
        var areaRepository = Substitute.For<IRepository<Area>>();
        var reportTypeRepository = Substitute.For<IRepository<ReportType>>();
        var photoProcessor = Substitute.For<IPhotoProcessor>();

        var user = new User("test@test.com", "password", "firstname", "lastname");
        userRepository.GetAllQueryable().Returns(new List<User> { user }.AsQueryable());
        
        var reportType = new ReportType("ReportType");
        reportTypeRepository.GetAllQueryable().Returns(new List<ReportType> { reportType }.AsQueryable());

        var service = new ReportService(reportRepository, userRepository, areaRepository, reportTypeRepository, photoProcessor);
        var request = new CreateReportRequest
        {
            Latitude = 999,
            Longitude = 26.1025,
            ReportTypeId = new Guid()
        };
        
        // Act & Assert
        await Assert.ThrowsAsync<InvalidOperationException>(() => service.CreateAsync(
            user.Id,
            request,
            CancellationToken.None
        ));
    }

    [Fact]
    public async Task GetPendingAsync_ShouldReturnOnlyPendingReports()
    {
        // Arrange
        var reportRepository = Substitute.For<IRepository<Report>>();
        var userRepository = Substitute.For<IRepository<User>>();
        var areaRepository = Substitute.For<IRepository<Area>>();
        var reportTypeRepository = Substitute.For<IRepository<ReportType>>();
        var photoProcessor = Substitute.For<IPhotoProcessor>();
        
        var user = new User(
            "moderator@test.com",
            "password",
            "Test",
            "Moderator");

        var pendingReport = new Report(
            new Point(26.1025, 44.4268),
            "Pending report",
            user,
            new ReportType("ReportType"));

        var approvedReport = new Report(
            new Point(26.1025, 44.4268),
            "Approved report",
            user,
            new ReportType("ReportType"));

        approvedReport.Approve(Priority.Medium);

        var reports = new List<Report>
        {
            pendingReport,
            approvedReport
        };

        reportRepository
            .GetAllQueryable()
            .Returns(reports.BuildMock());
        
        var service = new ReportService(reportRepository, userRepository, areaRepository, reportTypeRepository, photoProcessor);

        // Act
        var result = await service.GetPendingAsync(
            1,
            10,
            CancellationToken.None);

        // Assert
        Assert.Single(result.Items);
        Assert.Equal("Pending", result.Items[0].Status);
        Assert.Equal(1, result.TotalCount);
        Assert.Equal(1, result.PageNumber);
        Assert.Equal(10, result.PageSize);
    }

    [Fact]
    public async Task GetPendingAsync_ShouldReturnCorrectPage_WhenMoreReportsThanPageSizeExist()
    {
        // Arrange
        var reportRepository = Substitute.For<IRepository<Report>>();
        var userRepository = Substitute.For<IRepository<User>>();
        var areaRepository = Substitute.For<IRepository<Area>>();
        var reportTypeRepository = Substitute.For<IRepository<ReportType>>();
        var photoProcessor = Substitute.For<IPhotoProcessor>();
        
        var user = new User(
            "moderator@test.com",
            "password",
            "Test",
            "Moderator");

        var reports = Enumerable
            .Range(1, 12)
            .Select(index => new Report(
                new Point(26.1025, 44.4268),
                $"Pending report {index}",
                user,
                new ReportType("ReportType")))
            .ToList();

        reportRepository
            .GetAllQueryable()
            .Returns(reports.BuildMock());
        
        var service = new ReportService(reportRepository, userRepository, areaRepository, reportTypeRepository, photoProcessor);
        
        // Act
        var result = await service.GetPendingAsync(
            2,
            10,
            CancellationToken.None);

        // Assert
        Assert.Equal(2, result.Items.Count);
        Assert.Equal(12, result.TotalCount);
        Assert.Equal(2, result.PageNumber);
        Assert.Equal(10, result.PageSize);
    }

    [Fact]
    public async Task ApproveAsync_ShouldChangeStatusToApproved_WhenReportExists()
    {
        // Arrange
        var reportRepository = Substitute.For<IRepository<Report>>();
        var userRepository = Substitute.For<IRepository<User>>();
        var areaRepository = Substitute.For<IRepository<Area>>();
        var reportTypeRepository = Substitute.For<IRepository<ReportType>>();
        var photoProcessor = Substitute.For<IPhotoProcessor>();
        
        var user = new User(
            "moderator@test.com",
            "password",
            "Test",
            "Moderator");

        var report = new Report(
            new Point(26.1025, 44.4268),
            "Pothole",
            user,
            new ReportType("ReportType"));

        reportRepository
            .GetAllQueryable()
            .Returns(new List<Report> { report }.AsQueryable());

        var service = new ReportService(reportRepository, userRepository, areaRepository, reportTypeRepository, photoProcessor);

        // Act
        var result = await service.ApproveAsync(report.Id, "medium", CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Approved", result.Status);

        await reportRepository
            .Received(1)
            .UpdateAsync(
                report,
                CancellationToken.None);
    }
    
    [Fact]
    public async Task ApproveAsync_ShouldDefaultToLowPriority_WhenPriorityIsUnrecognized()
    {
        // Arrange
        var reportRepository = Substitute.For<IRepository<Report>>();
        var userRepository = Substitute.For<IRepository<User>>();
        var areaRepository = Substitute.For<IRepository<Area>>();
        var reportTypeRepository = Substitute.For<IRepository<ReportType>>();
        var photoProcessor = Substitute.For<IPhotoProcessor>();

        var user = new User(
            "moderator@test.com",
            "password",
            "Test",
            "Moderator");

        var report = new Report(
            new Point(26.1025, 44.4268),
            "Pothole",
            user,
            new ReportType("ReportType"));

        reportRepository
            .GetAllQueryable()
            .Returns(new List<Report> { report }.AsQueryable());
        
        var service = new ReportService(reportRepository, userRepository, areaRepository, reportTypeRepository, photoProcessor);

        // Act
        var result = await service.ApproveAsync(report.Id, "unknown", CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Low", result.Priority);
    }

    [Fact]
    public async Task RejectAsync_ShouldChangeStatusToRejected_WhenReportExists()
    {
        // Arrange
        var reportRepository = Substitute.For<IRepository<Report>>();
        var userRepository = Substitute.For<IRepository<User>>();
        var areaRepository = Substitute.For<IRepository<Area>>();
        var reportTypeRepository = Substitute.For<IRepository<ReportType>>();
        var photoProcessor = Substitute.For<IPhotoProcessor>();
        
        var user = new User(
            "moderator@test.com",
            "password",
            "Test",
            "Moderator");

        var report = new Report(
            new Point(26.1025, 44.4268),
            "Pothole",
            user,
            new ReportType("ReportType"));

        reportRepository
            .GetAllQueryable()
            .Returns(new List<Report> { report }.AsQueryable());
        
        var service = new ReportService(reportRepository, userRepository, areaRepository, reportTypeRepository, photoProcessor);

        // Act
        var result = await service.RejectAsync(
            report.Id,
            "Duplicate report",
            CancellationToken.None);

        // Assert
        Assert.Equal("Rejected", result.Status);
        Assert.Equal("Duplicate report", result.MessageToReporter);

        await reportRepository
            .Received(1)
            .UpdateAsync(
                report,
                CancellationToken.None);
    }
    
    [Fact]
    public async Task MarkAsSolvedAsync_ShouldMarkReportAsSolved_WhenReportExists()
    {
        // Arrange
        var reportRepository = Substitute.For<IRepository<Report>>();
        var userRepository = Substitute.For<IRepository<User>>();
        var areaRepository = Substitute.For<IRepository<Area>>();
        var reportTypeRepository = Substitute.For<IRepository<ReportType>>();
        var photoProcessor = Substitute.For<IPhotoProcessor>();

        var user = new User(
            "moderator@test.com",
            "password",
            "Test",
            "Moderator");

        var report = new Report(
            new Point(26.1025, 44.4268),
            "Pothole",
            user,
            new ReportType("ReportType"));

        reportRepository
            .GetAllQueryable()
            .Returns(new List<Report> { report }.AsQueryable());
        
        var service = new ReportService(reportRepository, userRepository, areaRepository, reportTypeRepository, photoProcessor);
        
        // Act
        var result = await service.MarkAsSolvedAsync(report.Id, "Fixed", CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.True(report.IsSolved);

        await reportRepository
            .Received(1)
            .UpdateAsync(
                report,
                CancellationToken.None);
    }
    
    [Fact]
    public async Task MarkAsSolvedAsync_ShouldReturnNull_WhenReportDoesNotExist()
    {
        // Arrange
        var reportRepository = Substitute.For<IRepository<Report>>();
        var userRepository = Substitute.For<IRepository<User>>();
        var areaRepository = Substitute.For<IRepository<Area>>();
        var reportTypeRepository = Substitute.For<IRepository<ReportType>>();
        var photoProcessor = Substitute.For<IPhotoProcessor>();
        
        reportRepository
            .GetAllQueryable()
            .Returns(new List<Report>().AsQueryable());

        var service = new ReportService(reportRepository, userRepository, areaRepository, reportTypeRepository, photoProcessor);
        
        // Act
        var result = await service.MarkAsSolvedAsync(Guid.NewGuid(), "Fixed", CancellationToken.None);

        // Assert
        Assert.Null(result);
    }
    
    [Fact]
    public async Task GetApprovedReportsAsync_ShouldReturnOnlyApprovedAndUnsolvedReports()
    {
        // Arrange
        var reportRepository = Substitute.For<IRepository<Report>>();
        var userRepository = Substitute.For<IRepository<User>>();
        var areaRepository = Substitute.For<IRepository<Area>>();
        var reportTypeRepository = Substitute.For<IRepository<ReportType>>();
        var photoProcessor = Substitute.For<IPhotoProcessor>();
        
        var user = new User(
            "moderator@test.com",
            "password",
            "Test",
            "Moderator");

        var approvedReport = new Report(
            new Point(26.1025, 44.4268),
            "Approved report",
            user,
            new ReportType("ReportType"));

        approvedReport.Approve(Priority.Medium);

        var solvedReport = new Report(
            new Point(26.1025, 44.4268),
            "Solved report",
            user,
            new ReportType("ReportType"));

        solvedReport.Approve(Priority.Medium);
        solvedReport.MarkAsSolved("Fixed");

        var pendingReport = new Report(
            new Point(26.1025, 44.4268),
            "Pending report",
            user,
            new ReportType("ReportType"));

        var reports = new List<Report>
        {
            approvedReport,
            solvedReport,
            pendingReport
        };

        reportRepository
            .GetAllQueryable()
            .Returns(reports.BuildMock());
        
        var service = new ReportService(reportRepository, userRepository, areaRepository, reportTypeRepository, photoProcessor);

        // Act
        var result = await service.GetApprovedReportsAsync(1, 10, CancellationToken.None);

        // Assert
        Assert.Single(result.Items);
        Assert.Equal("Approved report", result.Items[0].Description);
        Assert.Equal(1, result.TotalCount);
    }
    
    [Fact]
    public async Task GetApprovedReportsAsync_ShouldReturnEmptyList_WhenNoApprovedReportsExist()
    {
        // Arrange
        var reportRepository = Substitute.For<IRepository<Report>>();
        var userRepository = Substitute.For<IRepository<User>>();
        var areaRepository = Substitute.For<IRepository<Area>>();
        var reportTypeRepository = Substitute.For<IRepository<ReportType>>();
        var photoProcessor = Substitute.For<IPhotoProcessor>();

        var user = new User(
            "moderator@test.com",
            "password",
            "Test",
            "Moderator");

        var pendingReport = new Report(
            new Point(26.1025, 44.4268),
            "Pending report",
            user,
            new ReportType("ReportType"));

        var rejectedReport = new Report(
            new Point(26.1025, 44.4268),
            "Rejected report",
            user,
            new ReportType("ReportType"));

        rejectedReport.Reject();

        var reports = new List<Report>
        {
            pendingReport,
            rejectedReport
        };

        reportRepository
            .GetAllQueryable()
            .Returns(reports.BuildMock());
        
        var service = new ReportService(reportRepository, userRepository, areaRepository, reportTypeRepository, photoProcessor);
        
        // Act
        var result = await service.GetApprovedReportsAsync(1, 10, CancellationToken.None);

        // Assert
        Assert.Empty(result.Items);
        Assert.Equal(0, result.TotalCount);
    }

    [Fact]
    public async Task GetPendingAsync_ShouldReturnEmptyList_WhenNoPendingReportsExist()
    {
        // Arrange
        var reportRepository = Substitute.For<IRepository<Report>>();
        var userRepository = Substitute.For<IRepository<User>>();
        var areaRepository = Substitute.For<IRepository<Area>>();
        var reportTypeRepository = Substitute.For<IRepository<ReportType>>();
        var photoProcessor = Substitute.For<IPhotoProcessor>();
        
        var user = new User(
            "moderator@test.com",
            "password",
            "Test",
            "Moderator");

        var approvedReport = new Report(
            new Point(26.1025, 44.4268),
            "Approved report",
            user,
            new ReportType("ReportType"));

        approvedReport.Approve(Priority.Medium);

        var rejectedReport = new Report(
            new Point(26.1025, 44.4268),
            "Rejected report",
            user,
            new ReportType("ReportType"));

        rejectedReport.Reject();

        var reports = new List<Report>
        {
            approvedReport,
            rejectedReport
        };

        reportRepository
            .GetAllQueryable()
            .Returns(reports.BuildMock());

        var service = new ReportService(reportRepository, userRepository, areaRepository, reportTypeRepository, photoProcessor);
        
        // Act
        var result = await service.GetPendingAsync(
            1,
            10,
            CancellationToken.None);

        // Assert
        Assert.Empty(result.Items);
        Assert.Equal(0, result.TotalCount);
        Assert.Equal(1, result.PageNumber);
        Assert.Equal(10, result.PageSize);
    }

    [Fact]
    public async Task ApproveAsync_ShouldReturnNull_WhenReportDoesNotExist()
    {
        // Arrange
        var reportRepository = Substitute.For<IRepository<Report>>();
        var userRepository = Substitute.For<IRepository<User>>();
        var areaRepository = Substitute.For<IRepository<Area>>();
        var reportTypeRepository = Substitute.For<IRepository<ReportType>>();
        var photoProcessor = Substitute.For<IPhotoProcessor>();

        reportRepository
            .GetAllQueryable()
            .Returns(new List<Report>().AsQueryable());
        
        var service = new ReportService(reportRepository, userRepository, areaRepository, reportTypeRepository, photoProcessor);

        // Act
        var result = await service.ApproveAsync(Guid.NewGuid(), "medium", CancellationToken.None);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task RejectAsync_ShouldReturnNull_WhenReportDoesNotExist()
    {
        // Arrange
        var reportRepository = Substitute.For<IRepository<Report>>();
        var userRepository = Substitute.For<IRepository<User>>();
        var areaRepository = Substitute.For<IRepository<Area>>();
        var reportTypeRepository = Substitute.For<IRepository<ReportType>>();
        var photoProcessor = Substitute.For<IPhotoProcessor>();
        
        reportRepository
            .GetAllQueryable()
            .Returns(new List<Report>().AsQueryable());

        var service = new ReportService(reportRepository, userRepository, areaRepository, reportTypeRepository, photoProcessor);
        
        // Act
        var result = await service.RejectAsync(
            Guid.NewGuid(),
            null,
            CancellationToken.None);

        // Assert
        Assert.Null(result);
    }
    
    [Fact]
    public async Task SendMessageToReporterAsync_ShouldUpdateMessage_WhenReportExists()
    {
        // Arrange
        var reportRepository = Substitute.For<IRepository<Report>>();
        var userRepository = Substitute.For<IRepository<User>>();
        var areaRepository = Substitute.For<IRepository<Area>>();
        var reportTypeRepository = Substitute.For<IRepository<ReportType>>();
        var photoProcessor = Substitute.For<IPhotoProcessor>();

        var user = new User(
            "moderator@test.com",
            "password",
            "Test",
            "Moderator");

        var report = new Report(
            new Point(26.1025, 44.4268),
            "Pothole",
            user,
            new ReportType("ReportType"));

        reportRepository
            .GetAllQueryable()
            .Returns(new List<Report> { report }.BuildMock());
        
        var service = new ReportService(reportRepository, userRepository, areaRepository, reportTypeRepository, photoProcessor);
        
        // Act
        var result = await service.SendMessageToReporterAsync(report.Id, "We are looking into it", CancellationToken.None);

        // Assert
        Assert.NotNull(result);

        await reportRepository
            .Received(1)
            .UpdateAsync(
                report,
                CancellationToken.None);
    }

    [Fact]
    public async Task SendMessageToReporterAsync_ShouldReturnNull_WhenReportDoesNotExist()
    {
        // Arrange
        var reportRepository = Substitute.For<IRepository<Report>>();
        var userRepository = Substitute.For<IRepository<User>>();
        var areaRepository = Substitute.For<IRepository<Area>>();
        var reportTypeRepository = Substitute.For<IRepository<ReportType>>();
        var photoProcessor = Substitute.For<IPhotoProcessor>();

        reportRepository
            .GetAllQueryable()
            .Returns(new List<Report>().BuildMock());

        var service = new ReportService(reportRepository, userRepository, areaRepository, reportTypeRepository, photoProcessor);

        // Act
        var result = await service.SendMessageToReporterAsync(Guid.NewGuid(), "message", CancellationToken.None);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task GetUserReportsAsync_ShouldReturnOnlyReportsForGivenUser()
    {
        // Arrange
        var reportRepository = Substitute.For<IRepository<Report>>();
        var userRepository = Substitute.For<IRepository<User>>();
        var areaRepository = Substitute.For<IRepository<Area>>();
        var reportTypeRepository = Substitute.For<IRepository<ReportType>>();
        var photoProcessor = Substitute.For<IPhotoProcessor>();
        
        var user = new User(
            "user@test.com",
            "password",
            "Test",
            "User");

        var otherUser = new User(
            "other@test.com",
            "password",
            "Other",
            "User");

        var userReport = new Report(
            new Point(26.1025, 44.4268),
            "User report",
            user,
            new ReportType("ReportType"));

        var otherUserReport = new Report(
            new Point(26.1025, 44.4268),
            "Other user report",
            otherUser,
            new ReportType("ReportType"));

        var reports = new List<Report>
        {
            userReport,
            otherUserReport
        };

        reportRepository
            .GetAllQueryable()
            .Returns(reports.BuildMock());
        
        var service = new ReportService(reportRepository, userRepository, areaRepository, reportTypeRepository, photoProcessor);
        
        // Act
        var result = await service.GetUserReportsAsync(user.Id, 1, 10, CancellationToken.None);

        // Assert
        Assert.Single(result.Items);
        Assert.Equal("User report", result.Items[0].Description);
        Assert.Equal(1, result.TotalCount);
    }
    
    [Fact]
    public async Task GetUserReportsAsync_ShouldReturnEmptyList_WhenUserHasNoReports()
    {
        // Arrange
        var reportRepository = Substitute.For<IRepository<Report>>();
        var userRepository = Substitute.For<IRepository<User>>();
        var areaRepository = Substitute.For<IRepository<Area>>();
        var reportTypeRepository = Substitute.For<IRepository<ReportType>>();
        var photoProcessor = Substitute.For<IPhotoProcessor>();

        var user = new User(
            "user@test.com",
            "password",
            "Test",
            "User");

        var otherUserReport = new Report(
            new Point(26.1025, 44.4268),
            "Other user report",
            user,
            new ReportType("ReportType"));

        var reports = new List<Report> { otherUserReport };

        reportRepository
            .GetAllQueryable()
            .Returns(reports.BuildMock());
        
        var service = new ReportService(reportRepository, userRepository, areaRepository, reportTypeRepository, photoProcessor);
        
        // Act
        var result = await service.GetUserReportsAsync(Guid.NewGuid(), 1, 10, CancellationToken.None);

        // Assert
        Assert.Empty(result.Items);
        Assert.Equal(0, result.TotalCount);
    }
}
