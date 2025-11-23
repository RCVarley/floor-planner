import type {FloorPlanEntity} from "@/types/floorPlanEntities/floorPlan.ts";
import type {Point} from "@/types/svgEditor.ts";

export type SectionId = string & { __brand: 'SectionId' }

export interface Section extends FloorPlanEntity {
  id: SectionId
  shape: 'rectangle' | 'triangle' | 'polygon'
  points: Point[]
  subtractive?: boolean
  __brand: 'Section'
}

export function isSection(entity: FloorPlanEntity): entity is Section {
  return entity.__brand === 'Section'
}

export interface PolygonalSection extends Section {
  id: SectionId
  shape: 'polygon'
  points: Point[]
  subtractive?: boolean
}

export interface RectangularSection extends Section {
  id: SectionId
  shape: 'rectangle'
  points: [p1: Point, p2: Point, p3: Point, p4: Point]
  subtractive?: boolean
}

export interface TriangularSection extends Section {
  id: SectionId
  shape: 'triangle'
  points: [p1: Point, p2: Point, p3: Point]
  subtractive?: boolean
}

export function isRectangularSection(section: Section): section is RectangularSection {
  return section.shape === 'rectangle'
}

export function isTriangularSection(section: Section): section is TriangularSection {
  return section.shape === 'triangle'
}

export function isPolygonalSection(section: Section): section is PolygonalSection {
  return section.shape === 'polygon'
}