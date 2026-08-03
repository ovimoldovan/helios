# syntax=docker/dockerfile:1

# ---- Build stage --------------------------------------------------------
# Uses the .NET SDK image with Node.js added, because `dotnet publish` on
# Seeagle.Server builds the referenced seeagle.client.esproj as part of the
# same build (runs `npm ci` + `npm run build` under the hood) and copies the
# resulting static files into wwwroot. No separate client build step needed.
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build

RUN apt-get update \
    && apt-get install -y --no-install-recommends curl ca-certificates gnupg \
    && curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /src
COPY . .

RUN dotnet publish Seeagle.Server/Seeagle.Server.csproj -c Release -o /app/publish

# ---- Runtime stage -------------------------------------------------------
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_ENVIRONMENT=Production
EXPOSE 8080

# Render (and similar hosts) inject PORT at runtime; default to 8080 for local `docker run`.
ENTRYPOINT ["/bin/sh", "-c", "ASPNETCORE_URLS=http://+:${PORT:-8080} exec dotnet Seeagle.Server.dll"]
