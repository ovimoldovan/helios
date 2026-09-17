using Microsoft.AspNetCore.Mvc;

namespace Seeagle.MailService.Server.Controllers;

[ApiController]
[Route("/health")]
public class HealthController : ControllerBase
{
    [HttpGet]
    public ActionResult Health(CancellationToken cancellationToken)
    {
        return Ok();
    }
}