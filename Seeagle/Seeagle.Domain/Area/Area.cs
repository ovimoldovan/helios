namespace Seeagle.Domain.Area;
public class Area
{
    private Area()
    {
    }

    public Area(string name, Coordinates location)
    {
        Id = Guid.NewGuid();
        Name = name;
        Location = location;
    }

    public Guid Id { get; private set; }

    public string Name { get; private set; } = string.Empty;

    public Coordinates Location { get; private set; }
}