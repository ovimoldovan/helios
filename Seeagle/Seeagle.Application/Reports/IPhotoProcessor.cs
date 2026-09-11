namespace Seeagle.Application.Reports;

public interface IPhotoProcessor
{
    Task<ProcessedPhoto> ProcessAsync(Stream inputStream, CancellationToken ct = default);
}

public record ProcessedPhoto(byte[] Data, string ContentType);