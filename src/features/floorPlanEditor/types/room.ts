import type {BaseFloorPlanEntity, FloorPlanEntity} from "@floor-plan/types/floorPlan.ts"
import type {SectionId} from "@floor-plan/types/section.ts"
import type {FixtureId} from "@floor-plan/types/fixture.ts"
import type {Point} from "@editor/types/svgEditor.ts"

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