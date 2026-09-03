using NetTopologySuite.Geometries;

namespace Seeagle.Domain.Areas;

public class Area
{
    private Area() { }

    public Area(string name, Geometry geometry)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Name cannot be empty.", nameof(name));
        if (geometry is null)
            throw new ArgumentNullException(nameof(geometry));

        Id = Guid.NewGuid();
        Name = name;
        Geometry = geometry;
        CreatedUtc = DateTime.UtcNow;
    }

    public Guid Id { get; private set; }
    public string Name { get; private set; } = string.Empty;
    public Geometry Geometry { get; private set; } = null!;
    public DateTime CreatedUtc { get; private set; }
}