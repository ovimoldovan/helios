# ADR006 - PostGIS
___
## Status
Accepted

___
## Context
We need to choose a database for the backend. We need to store geospatial data and perform geospatial queries. PostGIS is a spatial database extender for PostgreSQL, which adds support for geographic objects allowing location queries to be run in SQL.

___
## Decision
Use PostGIS as a database. It's a well known and widely used extension for PostgreSQL that provides support for geospatial data and queries.

___
## Consequences
- **Pros:** Easy install - PostGIS is running on top of PostgreSQL, meaning that our existing tables don't become obsolete. Also, NetTopologySuite offers great support and integration with EF Core, making it easy to work with data on the Backend.
- **Cons:** -

___
## Alternatives Considered


___
**Date:** 6.08.2026