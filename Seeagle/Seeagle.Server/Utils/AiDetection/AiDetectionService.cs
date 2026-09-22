using System.Net.Http.Headers;

namespace Seeagle.Server.Utils.AiDetection;

public interface IAiDetectionService
{
    Task<double?> GetAiProbabilityScoreAsync(byte[] imageBytes, string contentType, string fileName, CancellationToken cancellationToken = default);
}

public class AiDetectionService : IAiDetectionService
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IConfiguration _configuration;

    public AiDetectionService(IHttpClientFactory httpClientFactory, IConfiguration configuration)
    {
        _httpClientFactory = httpClientFactory;
        _configuration = configuration;
    }

    public async Task<double?> GetAiProbabilityScoreAsync(byte[] imageBytes, string contentType, string fileName, CancellationToken cancellationToken = default)
    {
        try
        {
            var client = _httpClientFactory.CreateClient("SeeagleAssistant");
            var token = _configuration["SeeagleAssistant:ServiceToken"] ?? "";
            client.DefaultRequestHeaders.Add("X-Service-Token", token);

            using var content = new MultipartFormDataContent();
            var imageContent = new ByteArrayContent(imageBytes);
            imageContent.Headers.ContentType = MediaTypeHeaderValue.Parse(contentType);
            content.Add(imageContent, "file", fileName);

            var response = await client.PostAsync("/detect-ai", content, cancellationToken);
            
            if (response.IsSuccessStatusCode)
            {
                var result = await response.Content.ReadFromJsonAsync<System.Text.Json.JsonElement>(cancellationToken: cancellationToken);
                return result.GetProperty("aiProbability").GetDouble();
            }
        }
        catch (Exception)
        {
        }

        return null;
    }
}