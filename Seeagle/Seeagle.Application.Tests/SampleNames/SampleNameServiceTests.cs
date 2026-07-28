using NSubstitute;
using Seeagle.Application.SampleNames;
using Seeagle.Application.Common;
using Seeagle.Domain.SampleNames;

namespace Seeagle.Application.Tests.SampleNames;

public sealed class SampleNameServiceTests
{
    [Fact]
    public async Task CreateAsync_ShouldReturnDtoWithName_WhenNameIsValid()
    {
        // Arrange
        var repository = Substitute.For<IRepository<SampleName>>();
        var service = new SampleNameService(repository);
        var request = new CreateSampleNameRequest { Name = "Helios" };

        // Act
        var result = await service.CreateAsync(request, CancellationToken.None);

        // Assert
        Assert.Equal("Helios", result.Name);
    }

    [Fact]
    public async Task CreateAsync_ShouldPersistSampleName_WhenNameIsValid()
    {
        // Arrange
        var repository = Substitute.For<IRepository<SampleName>>();
        var service = new SampleNameService(repository);
        var request = new CreateSampleNameRequest { Name = "Helios" };

        // Act
        await service.CreateAsync(request, CancellationToken.None);

        // Assert
        await repository.Received(1).AddAsync(Arg.Is<SampleName>(sampleName => sampleName.Name == "Helios"), CancellationToken.None);
    }

    [Fact]
    public async Task CreateAsync_ShouldReturnTrimmedName_WhenNameHasSurroundingWhitespace()
    {
        // Arrange
        var repository = Substitute.For<IRepository<SampleName>>();
        var service = new SampleNameService(repository);
        var request = new CreateSampleNameRequest { Name = "  Helios  " };

        // Act
        var result = await service.CreateAsync(request, CancellationToken.None);

        // Assert
        Assert.Equal("Helios", result.Name);
    }

    [Fact]
    public async Task CreateAsync_ShouldPersistTrimmedName_WhenNameHasSurroundingWhitespace()
    {
        // Arrange
        var repository = Substitute.For<IRepository<SampleName>>();
        var service = new SampleNameService(repository);
        var request = new CreateSampleNameRequest { Name = "  Helios  " };

        // Act
        await service.CreateAsync(request, CancellationToken.None);

        // Assert
        await repository.Received(1).AddAsync(Arg.Is<SampleName>(sampleName => sampleName.Name == "Helios"), CancellationToken.None);
    }

    [Fact]
    public async Task GetAllAsync_ShouldMapEntitiesToDtos()
    {
        // Arrange
        var repository = Substitute.For<IRepository<SampleName>>();
        var first = new SampleName("First");
        var second = new SampleName("Second");
        repository.GetAllAsync(CancellationToken.None).Returns(new[] { first, second });
        var service = new SampleNameService(repository);

        // Act
        var items = await service.GetAllAsync(CancellationToken.None);

        // Assert
        Assert.Equal(["First", "Second"], items.Select(item => item.Name).OrderBy(name => name));
    }
}
