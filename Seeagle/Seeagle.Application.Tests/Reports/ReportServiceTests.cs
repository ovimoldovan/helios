using System.Collections;
using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore.Query;
using NetTopologySuite.Geometries;
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
        var request = new CreateReportRequest
        {
            Latitude = 44.4268,
            Longitude = 26.1025,
            Description = "Pothole"
        };

        // Act
        var result = await service.CreateAsync(
            user.Id,
            request,
            CancellationToken.None);

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
        var request = new CreateReportRequest
        {
            Latitude = 44.4268,
            Longitude = 26.1025,
            Description = "Pothole"
        };

        // Act
        var result = await service.CreateAsync(
            user.Id,
            request,
            CancellationToken.None);

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
        var request = new CreateReportRequest
        {
            Latitude = 44.4268,
            Longitude = 26.1025,
            Description = "Pothole"
        };

        // Act
        var result = await service.CreateAsync(
            user.Id,
            request,
            CancellationToken.None);

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
        var request = new CreateReportRequest
        {
            Latitude = 44.4268,
            Longitude = 26.1025,
            Description = "Pothole"
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

        var user = new User("test@test.com", "password", "firstname", "lastname");
        userRepository.GetAllQueryable().Returns(new List<User> { user }.AsQueryable());

        var service = new ReportService(reportRepository, userRepository);
        var request = new CreateReportRequest
        {
            Latitude = 44.4268,
            Longitude = 26.1025,
            Description = "Pothole"
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

        var user = new User("test@test.com", "password", "firstname", "lastname");
        userRepository.GetAllQueryable().Returns(new List<User> { user }.AsQueryable());

        var service = new ReportService(reportRepository, userRepository);
        var request = new CreateReportRequest
        {
            Latitude = 44.4268,
            Longitude = 26.1025,
            Description = null
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

        var user = new User("test@test.com", "password", "firstname", "lastname");
        userRepository.GetAllQueryable().Returns(new List<User> { user }.AsQueryable());

        var service = new ReportService(reportRepository, userRepository);
        var request = new CreateReportRequest
        {
            Latitude = 999,
            Longitude = 26.1025
        };

        // Act & Assert
        await Assert.ThrowsAsync<ArgumentOutOfRangeException>(
            () => service.CreateAsync(
                user.Id,
                request,
                CancellationToken.None));
    }

    [Fact]
    public async Task GetPendingAsync_ShouldReturnOnlyPendingReports()
    {
        // Arrange
        var reportRepository = Substitute.For<IRepository<Report>>();
        var userRepository = Substitute.For<IRepository<User>>();
        var service = new ReportService(reportRepository, userRepository);

        var user = new User(
            "moderator@test.com",
            "password",
            "Test",
            "Moderator");

        var pendingReport = new Report(
            new Point(26.1025, 44.4268),
            "Pending report",
            user);

        var approvedReport = new Report(
            new Point(26.1025, 44.4268),
            "Approved report",
            user);

        approvedReport.Approve();

        var reports = new List<Report>
        {
            pendingReport,
            approvedReport
        };

        reportRepository
            .GetAllQueryable()
            .Returns(reports.AsAsyncQueryable());

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
        var service = new ReportService(reportRepository, userRepository);

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
                user))
            .ToList();

        reportRepository
            .GetAllQueryable()
            .Returns(reports.AsAsyncQueryable());

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
        var service = new ReportService(reportRepository, userRepository);

        var user = new User(
            "moderator@test.com",
            "password",
            "Test",
            "Moderator");

        var report = new Report(
            new Point(26.1025, 44.4268),
            "Pothole",
            user);

        reportRepository
            .GetAllQueryable()
            .Returns(new List<Report> { report }.AsQueryable());

        // Act
        var result = await service.ApproveAsync(
            report.Id,
            CancellationToken.None);

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
    public async Task RejectAsync_ShouldChangeStatusToRejected_WhenReportExists()
    {
        // Arrange
        var reportRepository = Substitute.For<IRepository<Report>>();
        var userRepository = Substitute.For<IRepository<User>>();
        var service = new ReportService(reportRepository, userRepository);

        var user = new User(
            "moderator@test.com",
            "password",
            "Test",
            "Moderator");

        var report = new Report(
            new Point(26.1025, 44.4268),
            "Pothole",
            user);

        reportRepository
            .GetAllQueryable()
            .Returns(new List<Report> { report }.AsQueryable());

        // Act
        var result = await service.RejectAsync(
            report.Id,
            CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Rejected", result.Status);

        await reportRepository
            .Received(1)
            .UpdateAsync(
                report,
                CancellationToken.None);
    }

    [Fact]
    public async Task GetPendingAsync_ShouldReturnEmptyList_WhenNoPendingReportsExist()
    {
        // Arrange
        var reportRepository = Substitute.For<IRepository<Report>>();
        var userRepository = Substitute.For<IRepository<User>>();
        var service = new ReportService(reportRepository, userRepository);

        var user = new User(
            "moderator@test.com",
            "password",
            "Test",
            "Moderator");

        var approvedReport = new Report(
            new Point(26.1025, 44.4268),
            "Approved report",
            user);

        approvedReport.Approve();

        var rejectedReport = new Report(
            new Point(26.1025, 44.4268),
            "Rejected report",
            user);

        rejectedReport.Reject();

        var reports = new List<Report>
        {
            approvedReport,
            rejectedReport
        };

        reportRepository
            .GetAllQueryable()
            .Returns(reports.AsAsyncQueryable());

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
        var service = new ReportService(reportRepository, userRepository);

        reportRepository
            .GetAllQueryable()
            .Returns(new List<Report>().AsQueryable());

        // Act
        var result = await service.ApproveAsync(
            Guid.NewGuid(),
            CancellationToken.None);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task RejectAsync_ShouldReturnNull_WhenReportDoesNotExist()
    {
        // Arrange
        var reportRepository = Substitute.For<IRepository<Report>>();
        var userRepository = Substitute.For<IRepository<User>>();
        var service = new ReportService(reportRepository, userRepository);

        reportRepository
            .GetAllQueryable()
            .Returns(new List<Report>().AsQueryable());

        // Act
        var result = await service.RejectAsync(
            Guid.NewGuid(),
            CancellationToken.None);

        // Assert
        Assert.Null(result);
    }
}

internal static class AsyncQueryableExtensions
{
    public static IQueryable<T> AsAsyncQueryable<T>(
        this IEnumerable<T> source)
    {
        return new TestAsyncEnumerable<T>(source);
    }
}

internal sealed class TestAsyncQueryProvider<TEntity> : IAsyncQueryProvider
{
    private readonly IQueryProvider _inner;

    internal TestAsyncQueryProvider(IQueryProvider inner)
    {
        _inner = inner;
    }

    public IQueryable CreateQuery(Expression expression)
    {
        return new TestAsyncEnumerable<TEntity>(expression);
    }

    public IQueryable<TElement> CreateQuery<TElement>(
        Expression expression)
    {
        return new TestAsyncEnumerable<TElement>(expression);
    }

    public object? Execute(Expression expression)
    {
        return _inner.Execute(expression);
    }

    public TResult Execute<TResult>(Expression expression)
    {
        return _inner.Execute<TResult>(expression);
    }

    public TResult ExecuteAsync<TResult>(
        Expression expression,
        CancellationToken cancellationToken = default)
    {
        var expectedResultType = typeof(TResult).GetGenericArguments()[0];

        var executionResult = typeof(IQueryProvider)
            .GetMethod(
                nameof(IQueryProvider.Execute),
                1,
                new[] { typeof(Expression) })!
            .MakeGenericMethod(expectedResultType)
            .Invoke(_inner, new object[] { expression });

        return (TResult)typeof(Task)
            .GetMethod(nameof(Task.FromResult))!
            .MakeGenericMethod(expectedResultType)
            .Invoke(null, new[] { executionResult })!;
    }
}

internal sealed class TestAsyncEnumerable<T> :
    EnumerableQuery<T>,
    IAsyncEnumerable<T>,
    IQueryable<T>
{
    public TestAsyncEnumerable(
        IEnumerable<T> enumerable)
        : base(enumerable)
    {
    }

    public TestAsyncEnumerable(
        Expression expression)
        : base(expression)
    {
    }

    public IAsyncEnumerator<T> GetAsyncEnumerator(
        CancellationToken cancellationToken = default)
    {
        return new TestAsyncEnumerator<T>(
            this.AsEnumerable().GetEnumerator());
    }

    IQueryProvider IQueryable.Provider =>
        new TestAsyncQueryProvider<T>(this);
}

internal sealed class TestAsyncEnumerator<T> : IAsyncEnumerator<T>
{
    private readonly IEnumerator<T> _inner;

    public TestAsyncEnumerator(IEnumerator<T> inner)
    {
        _inner = inner;
    }

    public T Current => _inner.Current;

    public ValueTask<bool> MoveNextAsync()
    {
        return ValueTask.FromResult(_inner.MoveNext());
    }

    public ValueTask DisposeAsync()
    {
        _inner.Dispose();
        return ValueTask.CompletedTask;
    }
}