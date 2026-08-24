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
}