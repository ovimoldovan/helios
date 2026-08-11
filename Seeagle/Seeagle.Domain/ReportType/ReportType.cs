namespace Seeagle.Domain.ReportType;
public class ReportType
{
    private ReportType()
    {
    }

    public ReportType(string name)
    {
        Id = Guid.NewGuid();
        Name = name;
    }

    public Guid Id { get; private set; }

    public string Name { get; private set; } = string.Empty;
}