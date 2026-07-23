namespace Seeagle.Application.SampleNames;

public interface ISampleNameService
{
    Task<SampleNameDto> CreateAsync(CreateSampleNameRequest request, CancellationToken cancellationToken);

    Task<IReadOnlyList<SampleNameDto>> GetAllAsync(CancellationToken cancellationToken);
}
