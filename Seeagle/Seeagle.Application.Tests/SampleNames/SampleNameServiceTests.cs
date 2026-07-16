using Seeagle.Application.SampleNames;
using Seeagle.Application.Common;
using Seeagle.Domain.SampleNames;

namespace Seeagle.Application.Tests.SampleNames;

public sealed class SampleNameServiceTests
{
    [Fact]
    public async Task CreateAsync_ShouldPersistAndReturnDto_WhenNameIsValid()
    {
        // Arrange
        var repository = new InMemorySampleNameRepository();
        var service = new SampleNameService(repository);
        var request = new CreateSampleNameRequest { Name = "Helios" };

        // Act
        var result = await service.CreateAsync(request, CancellationToken.None);

        // Assert
        Assert.Equal("Helios", result.Name);
        Assert.Single(repository.Items);
        Assert.Equal("Helios", repository.Items[0].Name);
    }

    [Fact]
    public async Task CreateAsync_ShouldTrimNameBeforeSaving()
    {
        // Arrange
        var repository = new InMemorySampleNameRepository();
        var service = new SampleNameService(repository);
        var request = new CreateSampleNameRequest { Name = "  Helios  " };

        // Act
        var result = await service.CreateAsync(request, CancellationToken.None);

        // Assert
        Assert.Equal("Helios", result.Name);
        Assert.Single(repository.Items);
        Assert.Equal("Helios", repository.Items[0].Name);
    }

    [Fact]
    public async Task GetAllAsync_ShouldMapEntitiesToDtos()
    {
        // Arrange
        var repository = new InMemorySampleNameRepository();
        var service = new SampleNameService(repository);

        await repository.AddAsync(new SampleName("First"), CancellationToken.None);
        await repository.AddAsync(new SampleName("Second"), CancellationToken.None);

        // Act
        var items = await service.GetAllAsync(CancellationToken.None);

        // Assert
        Assert.Equal(2, items.Count);
        Assert.Contains(items, item => item.Name == "First");
        Assert.Contains(items, item => item.Name == "Second");
    }

    private sealed class InMemorySampleNameRepository : IRepository<SampleName>
    {
        public List<SampleName> Items { get; } = [];

        public Task AddAsync(SampleName sampleName, CancellationToken cancellationToken)
        {
            Items.Add(sampleName);
            return Task.CompletedTask;
        }

        public Task<IReadOnlyList<SampleName>> GetAllAsync(CancellationToken cancellationToken)
        {
            return Task.FromResult<IReadOnlyList<SampleName>>(Items.ToArray());
        }

        public Task UpdateAsync(SampleName entity, CancellationToken cancellationToken)
        {
            return Task.CompletedTask;
        }

        public Task DeleteAsync(SampleName entity, CancellationToken cancellationToken)
        {
            Items.Remove(entity);
            return Task.CompletedTask;
        }
    }
}
