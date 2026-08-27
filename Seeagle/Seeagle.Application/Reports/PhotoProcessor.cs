using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Jpeg;
using SixLabors.ImageSharp.Processing;

namespace Seeagle.Application.Reports;

public sealed class PhotoProcessor : IPhotoProcessor
{
    private const int MaxDimension = 1280;
    private const int MaxSizeBytes = 128 * 1024;

    public async Task<ProcessedPhoto> ProcessAsync(Stream inputStream, CancellationToken cancellationToken = default)
    {
        using var image = await Image.LoadAsync(inputStream, cancellationToken);
        
        image.Mutate(x=> x.Resize(new ResizeOptions
        {
            Mode = ResizeMode.Max,
            Size = new Size(MaxDimension, MaxDimension)
        }));

        for (var quality = 80; quality >= 20; quality -= 10)
        {
            using var ms = new MemoryStream();
            await image.SaveAsync(ms, new JpegEncoder{ Quality = quality}, cancellationToken);
            
            if (ms.Length <= MaxSizeBytes)
                return new ProcessedPhoto(ms.ToArray(), "image/jpeg");
        }

        throw new InvalidOperationException("Unable to compress photo under 128kb.");
    }
}