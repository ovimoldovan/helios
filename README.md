# helios

Starter implementation aligned with project ADRs:
- Monolith first (`ADR000`)
- Clean Architecture backend (`ADR001`)
- React frontend (`ADR002`)
- PostgreSQL database (starting simple, PostGIS can be added later) (`ADR003`)

## Solution structure

`Seeagle/`
- `Seeagle.Server` - Presentation layer (ASP.NET Core host, controllers, DI composition root)
- `Seeagle.Application` - Use cases, DTOs, validation, and ports (interfaces)
- `Seeagle.Domain` - Core entities and business rules
- `Seeagle.Infrastructure` - EF Core + PostgreSQL persistence implementation
- `Seeagle.Application.Tests` - xUnit unit tests (Arrange / Act / Assert)
- `seeagle.client` - React + TypeScript frontend

## Prerequisites

- .NET SDK 10
- Node.js (for the React client)
- PostgreSQL installed locally

## Local PostgreSQL setup (no Docker)

1. Install PostgreSQL.
2. Create a database named `seeagle`.
3. Ensure a local user exists (example uses `postgres/postgres`).
4. Confirm connection string in:
   - `Seeagle/Seeagle.Server/appsettings.Development.json`

Example connection string:

`Host=localhost;Port=5432;Database=seeagle;Username=postgres;Password=postgres`

## Run the app

From `Seeagle/`:

1. Restore/build:
   - `dotnet restore Seeagle.slnx`
   - `dotnet build Seeagle.slnx`
2. Run server (from Visual Studio profile or CLI):
   - `dotnet run --project Seeagle.Server`
3. Run frontend dev server (if not auto-launched by SPA proxy):
   - `cd seeagle.client`
   - `npm install`
   - `npm run dev`

Swagger is enabled in Development and launch settings open it automatically at:
- `https://localhost:7040/swagger`

## Database migrations

Initial migration is included in `Seeagle.Infrastructure/Persistence/Migrations`.

From `Seeagle/`, common EF Core migration commands are:

- Add a migration:

`dotnet dotnet-ef migrations add <MigrationName> --project .\Seeagle.Infrastructure\Seeagle.Infrastructure.csproj --startup-project .\Seeagle.Server\Seeagle.Server.csproj --output-dir Persistence\Migrations`

- Apply migrations to database:

`dotnet dotnet-ef database update --project .\Seeagle.Infrastructure\Seeagle.Infrastructure.csproj --startup-project .\Seeagle.Server\Seeagle.Server.csproj`

- Remove last migration (only if not applied in shared environments):

`dotnet dotnet-ef migrations remove --project .\Seeagle.Infrastructure\Seeagle.Infrastructure.csproj --startup-project .\Seeagle.Server\Seeagle.Server.csproj`

- List migrations:

`dotnet dotnet-ef migrations list --project .\Seeagle.Infrastructure\Seeagle.Infrastructure.csproj --startup-project .\Seeagle.Server\Seeagle.Server.csproj`

Recommended workflow:
1. Update Domain/Application/Infrastructure model code.
2. Add migration.
3. Review generated migration files before committing.
4. Run `database update` locally.
5. Run app/tests to confirm behavior.
6. Commit both code changes and migration files together.

At startup in Development, the server applies pending migrations automatically.

If `dotnet-ef` is missing, install local tool (from `Seeagle/`):

`dotnet new tool-manifest`

`dotnet tool install dotnet-ef --version 10.0.10`

## Sample feature walkthrough

Feature: `SampleNames`
- `POST /api/sample-names` - add a name
- `GET /api/sample-names` - list all names

Validation rules:
- Name is required
- Name max length is 10 characters

This is implemented in both:
- frontend (fast feedback)
- backend (authoritative validation)

## How dependency injection works here

The composition root is `Seeagle.Server/Program.cs`.

Key registrations:
- `SeeagleDbContext` (EF Core + Npgsql)
- `ISampleNameRepository -> SampleNameRepository`
- `ISampleNameService -> SampleNameService`
- `SampleNameValidator`

Controllers depend on Application interfaces, not Infrastructure classes directly.

## How to use the repository pattern

- Define repository contracts in `Seeagle.Application` (e.g. `IRepository<T>`).
- Implement them in `Seeagle.Infrastructure` (e.g. `EfRepository<T>`).
- Keep EF and SQL specifics only in Infrastructure.
- Keep business rules in Application/Domain.

## How to create a new endpoint (backend guideline)

1. Add/extend Domain entity in `Seeagle.Domain`.
2. Add request/response DTOs, validator, and service/use case in `Seeagle.Application`.
3. Add or reuse repository abstraction in `Seeagle.Application`.
4. Implement repository behavior in `Seeagle.Infrastructure`.
5. Register new dependencies in `Seeagle.Server/Program.cs`.
6. Add controller endpoint in `Seeagle.Server/Controllers`.
7. Add/adjust unit tests in `Seeagle.Application.Tests`.

## How to create a frontend module (frontend guideline)

Use this folder pattern under `seeagle.client/src`:
- `features/<feature-name>/components`
- `features/<feature-name>/api`
- `shared/api`
- `shared/types`

Recommended steps:
1. Create feature API file for server calls.
2. Create typed models in `shared/types`.
3. Create feature component (form/list/view).
4. Add client-side validation where useful.
5. Render the feature from `App.tsx`.

## Unit tests

`Seeagle.Application.Tests` uses xUnit and Arrange/Act/Assert.

Run tests:
- `dotnet test Seeagle.slnx`

Current tests cover:
- validation failure path
- successful create path
- list mapping path

## Future PostGIS upgrade notes

Starting with PostgreSQL keeps setup simple. To add PostGIS later:
1. Enable `postgis` extension in DB.
2. Add NetTopologySuite packages/config.
3. Add spatial columns/index migrations.
4. Extend repository methods with spatial query behavior.

Because EF and data access are isolated in Infrastructure, this upgrade remains localized.

## Communication schematic

```text
┌────────────────────────────┐
│ React Client (seeagle.client)
│ - SampleNamesModule        │
│ - sampleNamesApi (/api/*)  │
└───────────────┬────────────┘
				│ HTTP
				▼
┌────────────────────────────┐
│ Presentation (Seeagle.Server)
│ - SampleNamesController    │
│ - DI composition root      │
└───────────────┬────────────┘
				│ calls use case
				▼
┌────────────────────────────┐
│ Application (Seeagle.Application)
│ - SampleNameService        │
│ - IRepository<T> (port)    │
│ - DTOs + validation rules  │
└───────────────┬────────────┘
				│ interface/port
				▼
┌────────────────────────────┐
│ Infrastructure (Seeagle.Infrastructure)
│ - EfRepository<T>          │
│ - SeeagleDbContext         │
│ - EF configurations        │
└───────────────┬────────────┘
				│ EF Core / Npgsql
				▼
┌────────────────────────────┐
│ PostgreSQL                 │
└────────────────────────────┘

Dependency direction (compile-time):
Server -> Application
Infrastructure -> Application + Domain
Application -> Domain
Domain -> (no project dependencies)

Runtime flow for POST /api/sample-names:
Client -> Controller -> Service -> IRepository<SampleName>
	  -> EfRepository<SampleName> -> DbContext -> PostgreSQL
```
