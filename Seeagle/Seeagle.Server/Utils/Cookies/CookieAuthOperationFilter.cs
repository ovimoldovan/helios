using Microsoft.AspNetCore.Authorization;
using Microsoft.OpenApi;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace Seeagle.Server.Utils.Cookies;

public class CookieAuthOperationFilter : IOperationFilter
{
    public void Apply(OpenApiOperation operation, OperationFilterContext context)
    {
        var hasAuthorize = context.MethodInfo.DeclaringType!.GetCustomAttributes(true).OfType<AuthorizeAttribute>().Any()
                           || context.MethodInfo.GetCustomAttributes(true).OfType<AuthorizeAttribute>().Any();

        if (!hasAuthorize) return;

        var scheme = new OpenApiSecuritySchemeReference("cookieAuth", context.Document);

        operation.Security =
        [
            new OpenApiSecurityRequirement
            {
                [scheme] = new List<string>()
            }
        ];
    }
}