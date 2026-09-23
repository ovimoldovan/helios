using Microsoft.EntityFrameworkCore;
using NetTopologySuite.Geometries;
using Seeagle.Application.Common;
using Seeagle.Domain.Areas;
using Seeagle.Domain.Reports;
using System.Text.RegularExpressions;

namespace Seeagle.Application.Areas;

public sealed class AreaService(IRepository<Area> repository, IRepository<Report> reportRepository) : IAreaService
{
    private static readonly GeometryFactory GeometryFactory =
        new(new PrecisionModel(), 4326);
    
    private static string GenerateSlug(string name)
    {
        var slug = name.Trim().ToLowerInvariant();
        slug = Regex.Replace(slug, @"[^a-z0-9\s-]", "");
        slug = Regex.Replace(slug, @"\s+", "-");
        slug = Regex.Replace(slug, @"-+", "-");
        return slug.Trim('-');
    }

    private async Task<string> GenerateUniqueSlugAsync(string name, CancellationToken cancellationToken, Guid? excludeId = null)
    {
        var baseSlug = GenerateSlug(name);
        if (string.IsNullOrEmpty(baseSlug))
            baseSlug = "area";

        var slug = baseSlug;
        var suffix = 2;

        while (await repository.GetAllQueryable()
                   .AnyAsync(a => !a.IsDeleted && a.Slug == slug && a.Id != excludeId, cancellationToken))
        {
            slug = $"{baseSlug}-{suffix}";
            suffix++;
        }

        return slug;
    }

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

        var slug = await GenerateUniqueSlugAsync(request.Name, cancellationToken);
        var area = new Area(request.Name, geometry, slug);
        await repository.AddAsync(area, cancellationToken);

        return ToDto(area);
    }

    private static AreaDto ToDto(Area area)
    {
        var coords = area.Geometry.Coordinates
            .Select(c => new double[] { c.Y, c.X })
            .ToArray();

        return new AreaDto(area.Id, area.Name, area.Slug, coords, area.CreatedUtc);
    }
    
    public async Task<IReadOnlyList<AreaDto>> GetAllAsync(CancellationToken cancellationToken)
    {
        var areas = await repository.GetAllQueryable()
            .Where(a => !a.IsDeleted)
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

        if (area.Name != request.Name)
        {
            var slug = await GenerateUniqueSlugAsync(request.Name, cancellationToken, excludeId: area.Id);
            area.UpdateName(request.Name, slug);
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

        var reports = await reportRepository.GetAllQueryable()
            .Where(r => r.AreaId == id)
            .ToListAsync(cancellationToken);

        foreach (var report in reports)
        {
            report.SetAreaId(null);
            await reportRepository.UpdateAsync(report, cancellationToken);
        }

        area.Delete();
        await repository.UpdateAsync(area, cancellationToken);

        return true;
    }
    
}