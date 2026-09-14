namespace Seeagle.Application.Areas;

public interface IAreaService
{
    Task<AreaDto> CreateAsync(CreateAreaRequest request, CancellationToken cancellationToken);
    Task<IReadOnlyList<AreaDto>> GetAllAsync(CancellationToken cancellationToken);
    
    Task<AreaDto?> UpdateAsync(Guid id, UpdateAreaRequest request, CancellationToken cancellationToken);
    
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken);
}