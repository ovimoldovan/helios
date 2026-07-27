# ADR004 - Map Framework Choice

## Status
Proposed

## Context
We need to display an interactive map on the homepage. The map must support:
- Displaying a base map with standard tile layers
- Ability to add pins (points) for report locations
- Future support for lines and polygons
- Integration with PostGIS spatial data (as per ADR003)

## Decision
We adopt **Leaflet** with **react-leaflet** as the mapping solution.

- Open-source and free with no API key requirements
- Lightweight and performant
- Excellent React integration via react-leaflet
- Strong support for GeoJSON and spatial data
- Extensible with plugins (draw, heatmaps, clustering, etc.)
- Compatible with PostGIS geometry types (points, lines, polygons)

### Alternatives Considered
- **Google Maps**: Requires API key, potential costs, and stricter usage limits
- **Mapbox GL**: Requires API key, account setup, and commercial licensing considerations
- **OpenLayers**: More complex API, steeper learning curve

## Consequences
- **Pros**: Free, open-source, well-documented, easy to implement for MVP
- **Cons**: Less polished than commercial solutions; some advanced features may require additional plugins

## Date
21.07.2026