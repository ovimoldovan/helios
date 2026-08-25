namespace Seeagle.Application.Areas;

public interface IAreaService
{
    Task<AreaDto> CreateAsync(CreateAreaRequest request, CancellationToken cancellationToken);
}