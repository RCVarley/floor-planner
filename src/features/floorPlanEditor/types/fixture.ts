import type {BaseFloorPlanEntity, FloorPlanEntity} from "@floor-plan/types/floorPlan.ts"

export type FixtureId = string & { __brand: 'FixtureId' }

export interface Fixture extends FloorPlanEntity<'Room'> {
  id: FixtureId
  __brand: 'Fixture'
}

export function isFixture(entity: BaseFloorPlanEntity): entity is Fixture {
  return entity.__brand === 'Fixture'
}