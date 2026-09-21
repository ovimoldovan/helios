using Microsoft.AspNetCore.Mvc;
using Seeagle.MailService.Server.Auth;

namespace Seeagle.MailService.Server.Controllers;

[ApiController]
[Route("/health")]
[ServiceFilter(typeof(ApiKeyAuthFilter))]
public class HealthController(IConfiguration configuration) : ControllerBase
{
    [HttpGet]
    public ActionResult Health(CancellationToken cancellationToken)
    {
        return Ok();
    }
}