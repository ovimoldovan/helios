namespace Seeagle.Domain.Reports;

public class ReportType
{
    private ReportType()
    {
    }

    public ReportType(string name)
    {
        ValidateName(name);

        Id = Guid.NewGuid();
        Name = name;
        IsActive = true;
    }

    public Guid Id { get; private set; }

    public string Name { get; private set; } = string.Empty;

    public bool IsActive { get; private set; }

    public void Rename(string name)
    {
        ValidateName(name);
        Name = name;
    }

    public void Disable()
    {
        IsActive = false;
    }

    private static void ValidateName(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException(
                "Report type name is required.",
                nameof(name));

        if (name.Length > 20)
            throw new ArgumentException(
                "Report type name cannot exceed 20 characters.",
                nameof(name));
    }
}