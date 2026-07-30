namespace Seeagle.Domain.Area;
public class Coordinates
{
    private Coordinates()
    {
    }

    public Coordinates(double latitude, double longitude)
    {
        Latitude = latitude;
        Longitude = longitude;
    }

    public double Latitude { get; private set; }

    public double Longitude { get; private set; }
}
