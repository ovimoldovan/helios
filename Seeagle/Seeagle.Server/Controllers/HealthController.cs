using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Seeagle.Server.Controllers;

public enum AssistantStatus
{
    Online,
    Offline
}

public enum MailServiceStatus
{
    Online,
    Offline
}

[ApiController]
[Route("api/admin/health")]
[Authorize(Roles = "Admin")]
public class HealthController : ControllerBase
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IConfiguration _configuration;

    public HealthController(IHttpClientFactory httpClientFactory, IConfiguration configuration)
    {
        _httpClientFactory = httpClientFactory;
        _configuration = configuration;
    }

    [HttpGet("assistant")]
    public async Task<IActionResult> GetAssistantHealth()
    {
        try
        {
            var client = _httpClientFactory.CreateClient("SeeagleAssistant");
            var token = _configuration["SeeagleAssistant:ServiceToken"] ?? "";
            client.DefaultRequestHeaders.Add("X-Service-Token", token);

            var response = await client.GetAsync("/health");

            if (response.IsSuccessStatusCode)
            {
                return Ok(new { status = AssistantStatus.Online.ToString().ToLower() });
            }

            return Ok(new { status = AssistantStatus.Offline.ToString().ToLower() });
        }
        catch
        {
            return Ok(new { status = AssistantStatus.Offline.ToString().ToLower() });
        }
    }

    [HttpGet("mailservice")]
    public async Task<IActionResult> GetMailServiceHealth()
    {
        try
        {
            var client = _httpClientFactory.CreateClient("MailService");
            var token = _configuration["MailService:ServiceToken"] ?? "";
            client.DefaultRequestHeaders.Add("X-Service-Token", token);

            var response = await client.GetAsync("/health");

            if (response.IsSuccessStatusCode)
            {
                return Ok(new { status = MailServiceStatus.Online.ToString().ToLower() });
            }

            return Ok(new { status = MailServiceStatus.Offline.ToString().ToLower() });
        }
        catch
        {
            return Ok(new { status = MailServiceStatus.Offline.ToString().ToLower() });
        }
    }
}