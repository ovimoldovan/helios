using Microsoft.EntityFrameworkCore;
using NetTopologySuite.Geometries;
using Seeagle.Application.Common;
using Seeagle.Domain.Areas;

namespace Seeagle.Application.Areas;

public sealed class AreaService(IRepository<Area> repository) : IAreaService
{
    private static readonly GeometryFactory GeometryFactory =
        new(new PrecisionModel(), 4326);

    public async Task<AreaDto> CreateAsync(CreateAreaRequest request, CancellationToken cancellationToken)
    {
        Geometry geometry;

        if (request.Coordinates.Length == 2)
        {
            var nwLat = request.Coordinates[0][0];
            var nwLng = request.Coordinates[0][1];
            var seLat = request.Coordinates[1][0];
            var seLng = request.Coordinates[1][1];

            geometry = GeometryFactory.CreatePolygon([
                new Coordinate(nwLng, nwLat),
                new Coordinate(seLng, nwLat),
                new Coordinate(seLng, seLat),
                new Coordinate(nwLng, seLat),
                new Coordinate(nwLng, nwLat),
            ]);
        }
        else
        {
            var coords = request.Coordinates
                .Select(c => new Coordinate(c[1], c[0]))
                .ToList();

            if (coords.First() != coords.Last())
                coords.Add(coords.First());

            geometry = GeometryFactory.CreatePolygon(coords.ToArray());
        }

        var area = new Area(request.Name, geometry);
        await repository.AddAsync(area, cancellationToken);

        return ToDto(area);
    }

    private static AreaDto ToDto(Area area)
    {
        var coords = area.Geometry.Coordinates
            .Select(c => new double[] { c.Y, c.X })
            .ToArray();

        return new AreaDto(area.Id, area.Name, coords, area.CreatedUtc);
    }
    
    public async Task<IReadOnlyList<AreaDto>> GetAllAsync(CancellationToken cancellationToken)
    {
        var areas = await repository.GetAllQueryable()
            .OrderBy(a => a.Name)
            .ToListAsync(cancellationToken);

        return areas.Select(ToDto).ToList();
    }

    public async Task<AreaDto?> UpdateAsync(Guid id, UpdateAreaRequest request, CancellationToken cancellationToken)
    {
        var area = await repository.GetAllQueryable()
            .FirstOrDefaultAsync(a => a.Id == id, cancellationToken);

        if (area is null)
        {
            return null;
        }

        // Actualizează numele
        area.UpdateName(request.Name);

        // Dacă s-au trimis și coordonate noi, actualizează și geometria
        if (request.Coordinates is not null && request.Coordinates.Length > 0)
        {
            // TODO: Implementează actualizarea geometriei
            // area.UpdateGeometry(newGeometry);
        }

        await repository.UpdateAsync(area, cancellationToken);

        return ToDto(area);
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var area = await repository.GetAllQueryable()
            .FirstOrDefaultAsync(a => a.Id == id, cancellationToken);

        if (area is null)
        {
            return false;
        }

        await repository.DeleteAsync(area, cancellationToken);
        return true;
    }
    
}