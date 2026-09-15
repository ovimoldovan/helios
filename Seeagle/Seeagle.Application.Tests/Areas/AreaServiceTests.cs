using MockQueryable;
using NetTopologySuite.Geometries;
using NSubstitute;
using Seeagle.Application.Areas;
using Seeagle.Application.Common;
using Seeagle.Domain.Areas;

namespace Seeagle.Application.Tests.Areas;

public sealed class AreaServiceTests
{
    [Fact]
    public async Task DeleteAsync_ShouldSoftDeleteArea_WhenAreaExists()
    {
        // Arrange
        var repository = Substitute.For<IRepository<Area>>();

        var geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);
        var geometry = geometryFactory.CreatePolygon([
            new Coordinate(26.0, 44.5),
            new Coordinate(26.2, 44.5),
            new Coordinate(26.2, 44.3),
            new Coordinate(26.0, 44.3),
            new Coordinate(26.0, 44.5)
        ]);

        var area = new Area("Test area", geometry);

        repository
            .GetAllQueryable()
            .Returns(new List<Area> { area }.BuildMock());

        var service = new AreaService(repository);

        // Act
        var result = await service.DeleteAsync(
            area.Id,
            CancellationToken.None);

        // Assert
        Assert.True(result);
        Assert.True(area.IsDeleted);

        await repository
            .Received(1)
            .UpdateAsync(
                area,
                CancellationToken.None);

        await repository
            .DidNotReceive()
            .DeleteAsync(
                area,
                CancellationToken.None);
    }
}