/**
 * Geometric projection tools for SVG World Map.
 * Standard Equirectangular projection mapping latitude and longitude to [x, y] coordinates.
 */

export const MAP_WIDTH = 1000;
export const MAP_HEIGHT = 500;

export function projectLatLng(lat: number, lng: number): { x: number; y: number } {
  // Longitude ranges -180 to 180 -> X ranges 0 to MAP_WIDTH
  const x = ((lng + 180) / 360) * MAP_WIDTH;

  // Latitude ranges -90 to 90 -> Y ranges MAP_HEIGHT to 0
  // Standard equirectangular with minor vertical scaling for aesthetics
  const latRad = (lat * Math.PI) / 180;
  // Natural earth aspect adjustment
  const y = (1 - (lat + 85) / 170) * MAP_HEIGHT;

  return {
    x: Math.max(10, Math.min(MAP_WIDTH - 10, x)),
    y: Math.max(10, Math.min(MAP_HEIGHT - 10, y)),
  };
}

/**
 * Creates an elegant curved quadratic bezier SVG path between two coordinates
 */
export function createArcPath(
  start: { lat: number; lng: number },
  end: { lat: number; lng: number }
): string {
  const p1 = projectLatLng(start.lat, start.lng);
  const p2 = projectLatLng(end.lat, end.lng);

  // Midpoint
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const dist = Math.sqrt(dx * dx + dy * dy);

  // Arch height proportional to distance
  const arch = Math.min(80, Math.max(25, dist * 0.18));

  // Control point displaced upwards / perpendicular
  const midX = (p1.x + p2.x) / 2;
  const midY = (p1.y + p2.y) / 2 - arch;

  return `M ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} Q ${midX.toFixed(1)} ${midY.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
}

/**
 * Calculate Great Circle distance between two coordinates in kilometers (Haversine formula)
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}
