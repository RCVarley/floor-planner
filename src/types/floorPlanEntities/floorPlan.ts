import type {Building} from "@/types/floorPlanEntities/building.ts";
import type {Floor} from "@/types/floorPlanEntities/floor.ts";
import type {Room} from "@/types/floorPlanEntities/room.ts";
import type {Section} from "@/types/floorPlanEntities/section.ts";
import type {Fixture} from "@/types/floorPlanEntities/fixture.ts";
import type {Label, LabelId} from "@/types/floorPlanEntities/label.ts";

export type FloorPlanId = string & { __brand: 'FloorPlanId' }

export interface FloorPlan extends BaseFloorPlanEntity {
  id: FloorPlanId
  name: string
  buildings: Building[]
  floor: Floor[]
  rooms: Room[]
  sections: Section[]
  fixtures: Fixture[]
  labels: Label[]
  __brand: 'FloorPlan'
}

export type EntityType =
  | 'FloorPlan'
  | 'Building'
  | 'Floor'
  | 'Room'
  | 'Section'
  | 'Fixture'
  | 'Label'

export interface EntityParent {
  id: string
  type: EntityType
}

export interface BaseFloorPlanEntity {
  id: string
  __brand: EntityType
}

export interface FloorPlanEntity extends BaseFloorPlanEntity {
  id: string
  labelIds: LabelId[]
  parent: EntityParent
  __brand: EntityType
}

export type WallType = 'brick' | 'concrete' | 'steel' | 'wood' | 'glass' | 'metal' | 'plastic' | 'other'
export type RoofType = 'pitched' | 'flat'