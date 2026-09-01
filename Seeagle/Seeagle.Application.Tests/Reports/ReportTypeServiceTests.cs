using NSubstitute;
using Seeagle.Application.Common;
using Seeagle.Application.Reports;
using Seeagle.Domain.Reports;

namespace Seeagle.Application.Tests.Reports;

public sealed class ReportTypeServiceTests
{
    [Fact]
    public async Task CreateAsync_ShouldPersistReportType_WhenNameIsValid()
    {
        // Arrange
        var repository = Substitute.For<IRepository<ReportType>>();
        repository
            .GetAllQueryable()
            .Returns(new List<ReportType>().AsQueryable());

        var service = new ReportTypeService(repository);
        var request = new CreateReportTypeRequest
        {
            Name = "Pothole"
        };

        // Act
        await service.CreateAsync(request, CancellationToken.None);

        // Assert
        await repository
            .Received(1)
            .AddAsync(
                Arg.Is<ReportType>(reportType => reportType.Name == "Pothole"),
                CancellationToken.None);
    }

    [Fact]
    public async Task CreateAsync_ShouldThrowArgumentException_WhenNameExceeds20Characters()
    {
        // Arrange
        var repository = Substitute.For<IRepository<ReportType>>();
        repository
            .GetAllQueryable()
            .Returns(new List<ReportType>().AsQueryable());

        var service = new ReportTypeService(repository);
        var request = new CreateReportTypeRequest
        {
            Name = "ThisNameHasMoreThan20Characters"
        };

        // Act & Assert
        await Assert.ThrowsAsync<ArgumentException>(() =>
            service.CreateAsync(request, CancellationToken.None));

        await repository
            .DidNotReceive()
            .AddAsync(
                Arg.Any<ReportType>(),
                Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task CreateAsync_ShouldThrowInvalidOperationException_WhenReportTypeAlreadyExists()
    {
        // Arrange
        var repository = Substitute.For<IRepository<ReportType>>();

        var existingReportType = new ReportType("Police");

        repository
            .GetAllQueryable()
            .Returns(new List<ReportType>
            {
                existingReportType
            }.AsQueryable());

        var service = new ReportTypeService(repository);
        var request = new CreateReportTypeRequest
        {
            Name = "police"
        };

        // Act & Assert
        await Assert.ThrowsAsync<InvalidOperationException>(() =>
            service.CreateAsync(request, CancellationToken.None));

        await repository
            .DidNotReceive()
            .AddAsync(
                Arg.Any<ReportType>(),
                Arg.Any<CancellationToken>());
    }
    
    [Fact]
    public async Task UpdateAsync_ShouldRenameReportType_WhenNameIsValid()
    {
        // Arrange
        var repository = Substitute.For<IRepository<ReportType>>();

        var existingReportType = new ReportType("Police");

        repository
            .GetAllQueryable()
            .Returns(new List<ReportType>
            {
                existingReportType
            }.AsQueryable());

        var service = new ReportTypeService(repository);
        var request = new UpdateReportTypeRequest
        {
            Name = "Traffic"
        };

        // Act
        var result = await service.UpdateAsync(
            existingReportType.Id,
            request,
            CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Traffic", result.Name);

        await repository
            .Received(1)
            .UpdateAsync(
                Arg.Is<ReportType>(reportType => reportType.Name == "Traffic"),
                CancellationToken.None);
    }

    [Fact]
    public async Task DisableAsync_ShouldDisableReportType()
    {
        // Arrange
        var repository = Substitute.For<IRepository<ReportType>>();

        var existingReportType = new ReportType("Police");

        repository
            .GetAllQueryable()
            .Returns(new List<ReportType>
            {
                existingReportType
            }.AsQueryable());

        var service = new ReportTypeService(repository);

        // Act
        var result = await service.DisableAsync(
            existingReportType.Id,
            CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.False(result.IsActive);

        await repository
            .Received(1)
            .UpdateAsync(
                Arg.Is<ReportType>(reportType => !reportType.IsActive),
                CancellationToken.None);
    }
}

