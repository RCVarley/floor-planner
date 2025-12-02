import type {Building} from "@/types/floorPlanEntities/building.ts";
import type {Floor} from "@/types/floorPlanEntities/floor.ts";
import type {Room} from "@/types/floorPlanEntities/room.ts";
import type {Section} from "@/types/floorPlanEntities/section.ts";
import type {Fixture} from "@/types/floorPlanEntities/fixture.ts";
import type {Label, LabelId} from "@/types/floorPlanEntities/label.ts";
import type {Point} from "@/types/svgEditor.ts";

export type FloorPlanId = string & { __brand: 'FloorPlanId' }

export interface FloorPlan extends BaseFloorPlanEntity {
  id: FloorPlanId
  name: string
  buildings: Building[]
  floors: Floor[]
  rooms: Room[]
  sections: Section[]
  fixtures: Fixture[]
  labels: Label[]
  __brand: 'FloorPlan'
}

export function isFloorPlan(entity: BaseFloorPlanEntity): entity is FloorPlan {
  return entity?.__brand === 'FloorPlan'
}

export type EntityTypeName =
  | 'FloorPlan'
  | 'Building'
  | 'Floor'
  | 'Room'
  | 'Section'
  | 'Fixture'
  | 'Label'

export interface EntityStub<T extends EntityTypeName> {
  id: string
  type: T
}

export interface BaseFloorPlanEntity {
  id: string
  __brand: EntityTypeName
}

export interface FloorPlanEntity<ParentType extends EntityTypeName> extends BaseFloorPlanEntity {
  id: string
  points: Point[]
  labelIds: LabelId[]
  parent: EntityStub<ParentType> | null
  __brand: EntityTypeName
}

export type WallType = 'brick' | 'concrete' | 'steel' | 'wood' | 'glass' | 'metal' | 'plastic' | 'other'
export type RoofType = 'pitched' | 'flat'