import type {FloorPlanEntity, RoofType} from "@/types/floorPlanEntities/floorPlan.ts";
import type {RoomId} from "@/types/floorPlanEntities/room.ts";

export type FloorId = string & { __brand: 'FloorId' }

export interface Floor extends FloorPlanEntity {
  id: FloorId
  roomIds: RoomId[]
  roofType: RoofType | null
  __brand: 'Floor'
}

export function isFloor(entity: FloorPlanEntity): entity is Floor {
  return entity.__brand === 'Floor'
}