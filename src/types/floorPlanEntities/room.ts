import type {BaseFloorPlanEntity, FloorPlanEntity} from "@/types/floorPlanEntities/floorPlan.ts";
import type {SectionId} from "@/types/floorPlanEntities/section.ts";
import type {FixtureId} from "@/types/floorPlanEntities/fixture.ts";
import type {Point} from "@/types/svgEditor.ts";

export type RoomId = string & { __brand: 'RoomId' }
export type WallId = string & { __brand: 'WallId' }

export interface Room extends FloorPlanEntity<'Floor'> {
  id: RoomId
  heightM: number | null
  outline: Point[]
  sectionIds: SectionId[]
  fixtureIds: FixtureId[]
  __brand: 'Room'
}

export function isRoom(entity: BaseFloorPlanEntity): entity is Room {
  return entity.__brand === 'Room'
}