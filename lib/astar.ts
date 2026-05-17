// A* pathfinding for delivery route visualization on the map.
// Maps geo coordinates onto a grid, seeds pseudo-random obstacles to simulate
// city blocks, then finds the shortest walkable path between two points.

export type GeoPoint = { lat: number; lng: number }

type GridNode = {
  row: number
  col: number
  g: number        // cost from start
  h: number        // heuristic to goal
  f: number        // g + h
  parent: GridNode | null
  walkable: boolean
}

const GRID = 24

// Manhattan distance heuristic
function heuristic(a: GridNode, b: GridNode): number {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col)
}

function geoToGrid(
  lat: number, lng: number,
  minLat: number, maxLat: number,
  minLng: number, maxLng: number,
): { row: number; col: number } {
  const latR = maxLat - minLat || 0.001
  const lngR = maxLng - minLng || 0.001
  return {
    row: Math.max(0, Math.min(GRID - 1, Math.round(((lat - minLat) / latR) * (GRID - 1)))),
    col: Math.max(0, Math.min(GRID - 1, Math.round(((lng - minLng) / lngR) * (GRID - 1)))),
  }
}

function gridToGeo(
  row: number, col: number,
  minLat: number, maxLat: number,
  minLng: number, maxLng: number,
): GeoPoint {
  return {
    lat: minLat + (row / (GRID - 1)) * (maxLat - minLat),
    lng: minLng + (col / (GRID - 1)) * (maxLng - minLng),
  }
}

// Deterministic PRNG seeded by a number — avoids random() variability between renders
function seededRng(seed: number) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    return Math.abs(s) / 0xffffffff
  }
}

function buildWalkableGrid(seed: number): boolean[][] {
  const rng = seededRng(seed)
  const grid: boolean[][] = Array.from({ length: GRID }, () => new Array(GRID).fill(true))

  // Place ~20 small 2×2 obstacle blocks to simulate city buildings
  for (let i = 0; i < 20; i++) {
    const r = Math.floor(rng() * (GRID - 2))
    const c = Math.floor(rng() * (GRID - 2))
    grid[r][c] = false
    grid[r + 1][c] = false
    grid[r][c + 1] = false
    grid[r + 1][c + 1] = false
  }

  return grid
}

/**
 * Runs A* from `start` (restaurant) to `end` (customer).
 * Returns an array of geo waypoints forming the delivery route.
 */
export function computeRoute(start: GeoPoint, end: GeoPoint): GeoPoint[] {
  const pad = 0.008
  const minLat = Math.min(start.lat, end.lat) - pad
  const maxLat = Math.max(start.lat, end.lat) + pad
  const minLng = Math.min(start.lng, end.lng) - pad
  const maxLng = Math.max(start.lng, end.lng) + pad

  // Seed is derived from both endpoints so the same pair always yields the same route
  const seed = Math.abs(Math.round((start.lat + start.lng + end.lat + end.lng) * 10000)) % 999983

  const walkable = buildWalkableGrid(seed)

  // Build node grid
  const nodes: GridNode[][] = Array.from({ length: GRID }, (_, r) =>
    Array.from({ length: GRID }, (_, c) => ({
      row: r, col: c,
      g: Infinity, h: 0, f: Infinity,
      parent: null,
      walkable: walkable[r][c],
    })),
  )

  const sg = geoToGrid(start.lat, start.lng, minLat, maxLat, minLng, maxLng)
  const eg = geoToGrid(end.lat, end.lng, minLat, maxLat, minLng, maxLng)

  // Always keep start/end walkable
  nodes[sg.row][sg.col].walkable = true
  nodes[eg.row][eg.col].walkable = true

  const startNode = nodes[sg.row][sg.col]
  const endNode   = nodes[eg.row][eg.col]

  startNode.g = 0
  startNode.h = heuristic(startNode, endNode)
  startNode.f = startNode.h

  const open: GridNode[] = [startNode]
  const closed = new Set<string>()

  const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]]

  while (open.length > 0) {
    // Pop lowest-f node
    open.sort((a, b) => a.f - b.f)
    const cur = open.shift()!
    const key = `${cur.row},${cur.col}`
    if (closed.has(key)) continue
    closed.add(key)

    if (cur.row === endNode.row && cur.col === endNode.col) {
      // Reconstruct path
      const path: GeoPoint[] = []
      let n: GridNode | null = cur
      while (n) {
        path.unshift(gridToGeo(n.row, n.col, minLat, maxLat, minLng, maxLng))
        n = n.parent
      }
      return path
    }

    for (const [dr, dc] of dirs) {
      const nr = cur.row + dr
      const nc = cur.col + dc
      if (nr < 0 || nr >= GRID || nc < 0 || nc >= GRID) continue
      const nb = nodes[nr][nc]
      if (!nb.walkable || closed.has(`${nr},${nc}`)) continue

      const moveCost = dr !== 0 && dc !== 0 ? 1.414 : 1
      const newG = cur.g + moveCost
      if (newG < nb.g) {
        nb.g = newG
        nb.h = heuristic(nb, endNode)
        nb.f = nb.g + nb.h
        nb.parent = cur
        const inOpen = open.some(n => n.row === nr && n.col === nc)
        if (!inOpen) open.push(nb)
      }
    }
  }

  // Fallback: interpolate a straight-line path if A* fails
  return Array.from({ length: 12 }, (_, i) => ({
    lat: start.lat + (end.lat - start.lat) * (i / 11),
    lng: start.lng + (end.lng - start.lng) * (i / 11),
  }))
}

/** Maps a Lahore area name to its approximate center coordinates. */
export function getAreaCoordinates(area: string): GeoPoint {
  const lookup: [string, GeoPoint][] = [
    ["DHA",          { lat: 31.4697, lng: 74.4094 }],
    ["Gulberg",      { lat: 31.5204, lng: 74.3587 }],
    ["Model Town",   { lat: 31.4750, lng: 74.3286 }],
    ["Johar Town",   { lat: 31.4620, lng: 74.2785 }],
    ["Bahria",       { lat: 31.3548, lng: 74.1817 }],
    ["Garden Town",  { lat: 31.4879, lng: 74.3312 }],
    ["Shadman",      { lat: 31.5131, lng: 74.3366 }],
    ["Township",     { lat: 31.4666, lng: 74.2748 }],
    ["Valencia",     { lat: 31.5017, lng: 74.2556 }],
    ["Cantt",        { lat: 31.5497, lng: 74.3264 }],
    ["PECHS",        { lat: 31.4934, lng: 74.3284 }],
    ["Faisal Town",  { lat: 31.4716, lng: 74.2912 }],
    ["Iqbal Town",   { lat: 31.4748, lng: 74.3050 }],
    ["Muslim Town",  { lat: 31.4896, lng: 74.2989 }],
    ["Cavalry",      { lat: 31.5353, lng: 74.3652 }],
    ["Wapda Town",   { lat: 31.4530, lng: 74.2675 }],
    ["Thokar",       { lat: 31.4080, lng: 74.2360 }],
  ]

  const lower = area.toLowerCase()
  for (const [key, coords] of lookup) {
    if (lower.includes(key.toLowerCase())) return coords
  }
  return { lat: 31.5204, lng: 74.3587 } // Lahore center fallback
}
