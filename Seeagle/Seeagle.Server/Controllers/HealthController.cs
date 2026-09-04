using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Seeagle.Server.Controllers;

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
                return Ok(new { status = "online" });
            }

            return Ok(new { status = "offline" });
        }
        catch
        {
            return Ok(new { status = "offline" });
        }
    }
}