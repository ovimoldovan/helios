using Microsoft.AspNetCore.Mvc;
using Seeagle.Application.SampleNames;

namespace Seeagle.Server.Controllers;

[ApiController]
[Route("api/sample-names")]
public sealed class SampleNamesController(ISampleNameService sampleNameService) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType<IReadOnlyList<SampleNameDto>>(StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<SampleNameDto>>> GetAll(CancellationToken cancellationToken)
    {
        var sampleNames = await sampleNameService.GetAllAsync(cancellationToken);
        return Ok(sampleNames);
    }

    [HttpPost]
    [ProducesResponseType<SampleNameDto>(StatusCodes.Status201Created)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<SampleNameDto>> Create(CreateSampleNameRequest request, CancellationToken cancellationToken)
    {
        var created = await sampleNameService.CreateAsync(request, cancellationToken);
        return Created($"/api/sample-names/{created.Id}", created);
    }
}
