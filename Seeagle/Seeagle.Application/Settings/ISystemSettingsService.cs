namespace Seeagle.Application.Settings;

public interface ISystemSettingsService
{
    Task<SystemSettingsDto> GetAsync(CancellationToken cancellationToken);
    Task<SystemSettingsDto> UpdateAsync(UpdateSystemSettingsRequest request, CancellationToken cancellationToken);
}