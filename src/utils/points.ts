import type {Point} from "@/types/floorPlan.ts"
import {type MaybeRef, unref} from "vue"

export function addPoints(...points: Point[]): Point {
  if (!points.length) throw new Error("No points to add")

  let x = 0, y = 0
  for (const point of points) {
    x += point.x
    y += point.y
  }

  return { x: Math.round(x), y: Math.round(y) }
}

export function subtractPoints(...points: Point[]): Point {
  if (!points.length) throw new Error("No points to subtract")

  let { x, y } = points[0]!
  for (let i = 1; i < points.length; i++) {
    console.assert(!!points[i], `point ${i} is should exist`)
    x -= points[i]!.x
    y -= points[i]!.y
  }

  return { x, y }
}

export function checkIfInside(point: MaybeRef<Point>, polygon: MaybeRef<Point[]>) {
  const { x: px, y: py } = unref(point)
  let inside = false

  const n = unref(polygon).length
  for (let i = 0, j = n - 1; i < n; j = i++) {
    const pi = unref(polygon)[i]
    const pj = unref(polygon)[j]

    if (!pi || !pj) {
      throw new Error('Out of bounds')
    }

    const { x: xi, y: yi } = pi
    const { x: xj, y: yj } = pj

    // Check if the edge straddles the horizontal line at py
    const intersectsY = (yi > py) !== (yj > py)
    if (!intersectsY) continue

    // Compute x-coordinate of the intersection of the edge with y = py
    const xIntersect = xi + ((py - yi) * (xj - xi)) / (yj - yi)

    // If the intersection is to the right of the point, toggle inside
    if (xIntersect > px) {
      inside = !inside
    }
  }

  return inside
}

export function distanceBetween(a: MaybeRef<Point>, b: MaybeRef<Point>) {
  const x = Math.pow(unref(b).x - unref(a).x, 2)
  const y = Math.pow(unref(b).y - unref(a).y, 2)

  return Math.sqrt(x + y)
}

export function snapToGrid(point: Point, snap: number) {
  const x = Math.round(point.x)
  const mx = x % snap

  const y = Math.round(point.y)
  const my = y % snap

  const nx = (mx
    ? mx >= snap / 2
      ? x - mx
      : x + snap - mx
    : x
  )

  const ny = (my
    ? my >= snap / 2
      ? y - my
      : y + snap - my
    : y
  )

  return {
    x: nx,
    y: ny,
  }
}

const point = { x: 49, y: 26 }
snapToGrid(point, 25)


export function triangleArea(root: Point, a: Point, b: Point) {
  const ax = a.x - root.x
  const ay = a.y - root.y
  const bx = b.x - root.x
  const by = b.y - root.y

  return Math.abs(ax * by - ay * bx) / 2
}

export function polygonArea(poly: Point[]): number {
  if (poly.length < 3) return 0

  let s = 0
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const pi = poly[i]!
    const pj = poly[j]!
    s += (pj.x * pi.y - pi.x * pj.y)
  }

  return Math.abs(s) / 2
}