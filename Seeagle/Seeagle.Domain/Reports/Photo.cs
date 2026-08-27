using System.Net.Mime;

namespace Seeagle.Domain.Reports;

public class Photo
{
    private const int MaxSizeBytes = 128 * 1024;

    private Photo()
    {
        ImageData = null!;
        ContentType = null!;
        Report = null!;
    }

    public Photo(byte[] imageData, string contentType, Report report)
    {
        if (imageData == null || imageData.Length == 0)
            throw new ArgumentException("Image data cannot be empty", nameof(imageData));
        if (imageData.Length > MaxSizeBytes)
            throw new PhotoTooLargeException("Photo cannot exceed 128kb.");
        if (string.IsNullOrEmpty(contentType))
            throw new ArgumentException("Content type cannot be empty", nameof(contentType));
        
        Id = Guid.NewGuid();
        ImageData = imageData;
        SizeBytes = imageData.Length;
        ContentType = contentType;
        CreatedUtc = DateTime.UtcNow;
        Report = report;
    }
    
    public Guid Id { get; private set; }
    public byte[] ImageData { get; private set; }
    public int SizeBytes { get; private set; }
    public string ContentType { get; private set; }
    public DateTime CreatedUtc { get; private set; }

    public Guid ReportId { get; private set; }
    public Report Report { get; private set; }
}