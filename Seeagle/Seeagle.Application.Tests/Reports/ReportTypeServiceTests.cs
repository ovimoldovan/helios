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
    public async Task UpdateAsync_ShouldReturnNull_WhenReportTypeDoesntExist()
    {
        //Arrange
        var repository = Substitute.For<IRepository<ReportType>>();

        var service = new ReportTypeService(repository);

        var request = new UpdateReportTypeRequest
        {
            Name = "NewName"
        };
        
        //Act
        var result = await service.UpdateAsync(
            new Guid(),
            request,
            CancellationToken.None
        );
        
        //Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task UpdateAsync_ShouldThrow_WhenReportTypeAlreadyExists()
    {
        //Arrange
        var repository = Substitute.For<IRepository<ReportType>>();

        var toUpdateReportType = new ReportType("ToUpdate");
        var existingReportType = new ReportType("Existing");
        repository
            .GetAllQueryable()
            .Returns(new List<ReportType>
            {
                toUpdateReportType,
                existingReportType
            }.AsQueryable());

        var service = new ReportTypeService(repository);

        var request = new UpdateReportTypeRequest
        {
            Name = "Existing"
        };
        
        //Act & Assert
        await Assert.ThrowsAsync<InvalidOperationException>(() => service.UpdateAsync(
            toUpdateReportType.Id,
            request,
            CancellationToken.None));
    }

    [Fact]
    public async Task ChangeStatusAsync_ShouldReturnNull_WhenReportTypeDoesntExist()
    {
        // Arrange
        var repository = Substitute.For<IRepository<ReportType>>();

        var service = new ReportTypeService(repository);

        // Act
        var result = await service.ChangeStatusAsync(new Guid(), CancellationToken.None);
        
        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task ChangeStatusAsync_ShouldSucceed_WhenReportExists()
    {
        // Arrange
        var repository = Substitute.For<IRepository<ReportType>>();
        var reportType = new ReportType("ReportType");
        repository.GetAllQueryable().Returns(new List<ReportType> { reportType }.AsQueryable());

        var service = new ReportTypeService(repository);
        
        // Act
        var result = await service.ChangeStatusAsync(reportType.Id, CancellationToken.None);
        
        // Assert
        Assert.NotNull(result);
        Assert.False(result.IsActive);
        
        // Act
        result = await service.ChangeStatusAsync(reportType.Id, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.True(result.IsActive);
    }
}

