namespace Seeagle.Domain.Reports;

public class ReportType
{
    private ReportType()
    {
    }

    public ReportType(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Report type name is required.", nameof(name));

        if (name.Length > 20)
            throw new ArgumentException("Report type name cannot exceed 20 characters.", nameof(name));

        Id = Guid.NewGuid();
        Name = name;
    }

    public Guid Id { get; private set; }

    public string Name { get; private set; } = string.Empty;
}