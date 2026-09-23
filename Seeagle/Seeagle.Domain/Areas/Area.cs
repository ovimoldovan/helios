using NetTopologySuite.Geometries;

namespace Seeagle.Domain.Areas;

public class Area
{
    private Area() { }

    public Area(string name, Geometry geometry, string slug)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Name cannot be empty.", nameof(name));
        if (geometry is null)
            throw new ArgumentNullException(nameof(geometry));
        if (string.IsNullOrWhiteSpace(slug))
            throw new ArgumentException("Slug cannot be empty.", nameof(slug));

        Id = Guid.NewGuid();
        Name = name;
        Geometry = geometry;
        Slug = slug;
        CreatedUtc = DateTime.UtcNow;
    }

    public Guid Id { get; private set; }
    public string Name { get; private set; } = string.Empty;
    public string Slug { get; private set; } = string.Empty;
    public Geometry Geometry { get; private set; } = null!;
    public DateTime CreatedUtc { get; private set; }
    
    public bool IsDeleted { get; private set; }

    public void Delete()
    {
        IsDeleted = true;
    }
    
    public void UpdateName(string name, string slug)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Name cannot be empty.", nameof(name));
    
        Name = name;
        Slug = slug;
    }
}