using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Seeagle.MailService.Server.Auth;

public class ApiKeyAuthFilter(IConfiguration configuration) : IAsyncActionFilter
{
    private const string HeaderName = "X-Service-Token";

    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        if (!context.HttpContext.Request.Headers.TryGetValue(HeaderName, out var providedKey))
        {
            context.Result = new UnauthorizedObjectResult("API key missing.");
            return;
        }

        if (!string.Equals(providedKey, configuration["MailService:ServiceToken"], StringComparison.Ordinal))
        {
            context.Result = new UnauthorizedObjectResult("Invalid API key.");
            return;
        }

        await next();
    }
}