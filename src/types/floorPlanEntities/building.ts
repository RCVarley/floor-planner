import type {FloorPlanEntity, WallType} from "@/types/floorPlanEntities/floorPlan.ts";
import type {FloorId} from "@/types/floorPlanEntities/floor.ts";

export type BuildingId = string & { __brand: 'BuildingId' }

export interface Building extends FloorPlanEntity {
  id: BuildingId
  floorIds: FloorId[]
  wallType: WallType | null
  __brand: 'Building'
}

export function isBuilding(entity: FloorPlanEntity): entity is Building {
  return entity.__brand === 'Building'
}