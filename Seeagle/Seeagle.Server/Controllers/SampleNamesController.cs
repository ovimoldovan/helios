using Microsoft.AspNetCore.Mvc;
using Seeagle.Application.SampleNames;

namespace Seeagle.Server.Controllers;

[ApiController]
[Route("api/sample-names")]
public sealed class SampleNamesController(ISampleNameService sampleNameService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<SampleNameDto>>> GetAll(CancellationToken cancellationToken)
    {
        var sampleNames = await sampleNameService.GetAllAsync(cancellationToken);
        return Ok(sampleNames);
    }

    [HttpPost]
    public async Task<ActionResult<SampleNameDto>> Create(CreateSampleNameRequest request, CancellationToken cancellationToken)
    {
        var created = await sampleNameService.CreateAsync(request, cancellationToken);
        return Created($"/api/sample-names/{created.Id}", created);
    }
}
