using Seeagle.Application.Common;
using Seeagle.Domain.SampleNames;

namespace Seeagle.Application.SampleNames;

public sealed class SampleNameService : ISampleNameService
{
    private readonly IRepository<SampleName> _sampleNameRepository;

    public SampleNameService(IRepository<SampleName> sampleNameRepository)
    {
        _sampleNameRepository = sampleNameRepository;
    }

    public async Task<SampleNameDto> CreateAsync(CreateSampleNameRequest request, CancellationToken cancellationToken)
    {
        var sampleName = new SampleName(request.Name.Trim());
        await _sampleNameRepository.AddAsync(sampleName, cancellationToken);

        return Map(sampleName);
    }

    public async Task<IReadOnlyList<SampleNameDto>> GetAllAsync(CancellationToken cancellationToken)
    {
        var sampleNames = await _sampleNameRepository.GetAllAsync(cancellationToken);
        return sampleNames
            .OrderByDescending(sampleName => sampleName.CreatedUtc)
            .Select(Map)
            .ToList();
    }

    private static SampleNameDto Map(SampleName sampleName) => new(sampleName.Id, sampleName.Name, sampleName.CreatedUtc);
}
