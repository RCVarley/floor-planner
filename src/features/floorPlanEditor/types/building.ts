import type {BaseFloorPlanEntity, EntityStub, FloorPlanEntity, WallType} from "@floor-plan/types/floorPlan.ts"
import type {FloorId} from "@floor-plan/types/floor.ts"

export type BuildingId = string & { __brand: 'BuildingId' }

export interface Building extends Omit<FloorPlanEntity<'Building'>, 'parent'> {
  id: BuildingId
  floorIds: FloorId[]
  wallType: WallType | null
  parent: EntityStub<'Building'> | null
  __brand: 'Building'
}

export function isBuilding(entity: BaseFloorPlanEntity): entity is Building {
  return entity.__brand === 'Building'
}