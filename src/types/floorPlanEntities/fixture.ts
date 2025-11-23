import type {FloorPlanEntity} from "@/types/floorPlanEntities/floorPlan.ts";

export type FixtureId = string & { __brand: 'FixtureId' }

export interface Fixture extends FloorPlanEntity {
  id: FixtureId
  __brand: 'Fixture'
}

export function isFixture(entity: FloorPlanEntity): entity is Fixture {
  return entity.__brand === 'Fixture'
}