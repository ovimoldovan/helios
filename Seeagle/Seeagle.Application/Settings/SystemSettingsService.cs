using Microsoft.EntityFrameworkCore;
using Seeagle.Application.Common;
using Seeagle.Domain.Settings;

namespace Seeagle.Application.Settings;

public sealed class SystemSettingsService(IRepository<SystemSettings> repository) : ISystemSettingsService
{
    public async Task<SystemSettingsDto> GetAsync(CancellationToken cancellationToken)
    {
        var settings = await GetSingletonAsync(cancellationToken);
        return ToDto(settings);
    }

    public async Task<SystemSettingsDto> UpdateAsync(UpdateSystemSettingsRequest request, CancellationToken cancellationToken)
    {
        var settings = await GetSingletonAsync(cancellationToken);

        settings.SetThresholds(
            request.DuplicateDistanceMeters,
            TimeSpan.FromHours(request.DuplicateTimeWindowHours));

        await repository.UpdateAsync(settings, cancellationToken);

        return ToDto(settings);
    }

    private async Task<SystemSettings> GetSingletonAsync(CancellationToken cancellationToken)
    {
        var settings = await repository.GetAllQueryable().FirstOrDefaultAsync(cancellationToken);

        if (settings is null)
            throw new InvalidOperationException("System settings row is missing. Check that the seeding migration ran.");

        return settings;
    }

    private static SystemSettingsDto ToDto(SystemSettings settings) => new(
        settings.Id,
        settings.DuplicateDistanceMeters,
        settings.DuplicateTimeWindow.TotalHours,
        settings.UpdatedUtc);
}