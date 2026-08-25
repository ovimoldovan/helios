namespace Seeagle.Domain.ReportTypes;

public class ReportType
{
    private ReportType() { }

    public ReportType(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Name cannot be empty.", nameof(name));

        Id = Guid.NewGuid();
        Name = name;
    }

    public Guid Id { get; private set; }
    public string Name { get; private set; } = string.Empty;
}