# ADR003-Database choice

## Status
Proposed

## Context
We need a primary database capable of efficiently storing and querying mixed geographic data — points, lines, and polygons — for a project centered around maps.

## Decision
We adopt PostgreSQL with the PostGIS extension as the primary database. PostGIS is not a separate database, but an extension installed on top of PostgreSQL that adds spatial data types (geometry, geography), spatial functions (ST_Contains, ST_Intersects, ST_DWithin, ST_Distance), and spatial indexing via GiST.

## Consequences
Pros: native support for points, lines, and polygons; fast spatial queries via GiST indexes; mature and well-tested spatial functions (intersections, containment, distances); native support for coordinate systems (SRID); minimal overhead to enable

Cons: additional learning curve for the team (geometry types, ST_* functions); additional infrastructure dependency (PostgreSQL image with PostGIS, backup/restore for spatial types); requires attention to spatial indexes in future migrations

## Alternatives Considered
Plain PostgreSQL

Date:13.07.2026

