import type {IsoDateTime} from "@/utils/dateHelpers.ts";

export type FloorPlanId = string & { __brand: 'FloorPlanId' }

export interface FloorPlan {
  id: FloorPlanId
  name: string
  data: FloorPlanData
  created?: IsoDateTime
  updated?: IsoDateTime
}

export interface FloorPlanData {
  rooms: Room[]
  openings: Opening[]
}

export interface Point {
  x: number
  y: number
}

export type WallId = string & { __brand: 'WallId' }
export type RoomId = string & { __brand: 'RoomId' }


export interface Room {
  id: RoomId
  heightM: number
  sections: Section[]
  hiddenEdges?: [Point, Point][]
  openings: Opening[]
  labels: Label[]
  offset: Point
}

export type SectionId = string & { __brand: 'SectionId' }

export interface Section {
  id: SectionId
  shape: 'rectangle'
  polygon: Point[]
  offset: Point
  subtractive?: boolean
}

export interface RoomPlanSection extends Section {
  points: string
  area: number
}

export type OpeningId = string & { __brand: 'OpeningId' }

export interface Opening {
  id: OpeningId
  roomId: RoomId
  wallId: WallId
  offset: number // 0..1 along wall
  widthM: number
  kind: 'door' | 'window'
  swing?: 'in' | 'out'
  heightM?: number
  hiddenEdges?: [Point, Point][]
  leaves?: 1 | 2
}

export type LabelId = string & { __brand: 'LabelId' }

export interface Label extends Point {
  id: LabelId
  text: string
}