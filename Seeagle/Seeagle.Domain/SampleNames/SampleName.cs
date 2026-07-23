namespace Seeagle.Domain.SampleNames;

public class SampleName
{
    private SampleName()
    {
    }

    public SampleName(string name)
    {
        Id = Guid.NewGuid();
        Name = name;
        CreatedUtc = DateTime.UtcNow;
    }

    public Guid Id { get; private set; }

    public string Name { get; private set; } = string.Empty;

    public DateTime CreatedUtc { get; private set; }
}
