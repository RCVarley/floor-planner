import type {
  FloorPlan, FloorPlanEntity, EntityParent, BaseFloorPlanEntity
} from "@/types/floorPlanEntities/floorPlan.ts";
import {uid} from "@/utils/ids.ts";
import type {PartialPick} from "@/types/utilities.ts";
import {fail, type Result, succeed} from "@/utils/errorHandling.ts";
import type {Building} from "@/types/floorPlanEntities/building.ts";
import type {Floor} from "@/types/floorPlanEntities/floor.ts";
import type {Room} from "@/types/floorPlanEntities/room.ts";
import type {PolygonalSection, RectangularSection, TriangularSection} from "@/types/floorPlanEntities/section.ts";
import type {Fixture} from "@/types/floorPlanEntities/fixture.ts";
import type {Label} from "@/types/floorPlanEntities/label.ts";

function createParent(entity: BaseFloorPlanEntity): EntityParent {
  return {
    id: entity.id,
    type: entity.__brand,
  }
}

export function createPlan(FloorPlan: Partial<FloorPlan> = {}): Result<FloorPlan> {
  return succeed({
    id: uid('plan'),
    name: 'Plan name',
    buildings: [],
    floor: [],
    rooms: [],
    sections: [],
    fixtures: [],
    labels: [],
    __brand: 'FloorPlan',
    ...FloorPlan
  })
}

function getParent<
  EntityType extends Partial<FloorPlanEntity>,
  ParentEntityType extends BaseFloorPlanEntity
>(
  entity: EntityType,
  parentEntity?: ParentEntityType
): [parent: EntityParent, rest: Omit<EntityType, 'parent'>] {
  const { parent, ...rest } = entity
  return [
    parent ?? createParent(parentEntity!),
    rest
  ]
}

export function createBuilding(building: Partial<Building>, parent: FloorPlan): Result<Building>
export function createBuilding(building: PartialPick<Building, 'parent'>): Result<Building>
export function createBuilding(building: Partial<Building>, parent?: FloorPlan): Result<Building> {
  if (!building.parent && !parent) {
    return fail('building:create:bad-parameters', 'Building must have a parent')
  }

  const [_parent, rest] = getParent(building, parent)

  return succeed({
    id: uid('build'),
    offset: null,
    wallType: null,
    parent: _parent,
    floorIds: [],
    labelIds: [],
    __brand: 'Building',
    ...rest,
  })
}

export function createFloor(floor: Partial<Floor>, parent: Building): Result<Floor>
export function createFloor(floor: PartialPick<Floor, 'parent'>): Result<Floor>
export function createFloor(floor: Partial<Floor>, parent?: Building): Result<Floor> {
  if (!floor.parent && !parent) {
    return fail('floor:create:bad-parameters', 'Floor must have a parent')
  }

  const [_parent, rest] = getParent(floor, parent)

  return succeed({
    id: uid('floor'),
    roofType: null,
    parent: _parent,
    roomIds: [],
    labelIds: [],
    __brand: 'Floor',
    ...rest,
  })
}

export function createRoom(room: PartialPick<Room, 'sectionIds'>, parent: Floor): Result<Room>
export function createRoom(room: PartialPick<Room, 'sectionIds' | 'parent'>): Result<Room>
export function createRoom(room: PartialPick<Room, 'sectionIds'>, parent?: Floor): Result<Room> {
  if (!room.sectionIds.length) {
    return fail('room:create:bad-parameters', 'Room must have at least one section')
  }

  if (!room.parent && !parent) {
    return fail('room:create:bad-parameters', 'Room must have a parent')
  }

  const [_parent, rest] = getParent(room, parent)

  return succeed({
    id: uid('room'),
    heightM: null,
    parent: _parent,
    fixtureIds: [],
    outline: [],
    labelIds: [],
    __brand: 'Room',
    ...rest as PartialPick<Room, 'sectionIds'>,
  })
}

export function createPolygonalSection(section: PartialPick<PolygonalSection, 'points'>, parent: Room): Result<PolygonalSection>
export function createPolygonalSection(section: PartialPick<PolygonalSection, 'points' | 'parent'>): Result<PolygonalSection>
export function createPolygonalSection(section: PartialPick<PolygonalSection, 'points'>, parent?: Room): Result<PolygonalSection> {
  if (!section.parent && !parent) {
    return fail('section:create:bad-parameters', 'Section must have a parent')
  }

  const [_parent, rest] = getParent(section, parent)

  return succeed({
    id: uid('poly'),
    shape: 'polygon',
    parent: _parent,
    labelIds: [],
    __brand: 'Section',
    ...rest,
  })
}

export function createRectangularSection(section: PartialPick<RectangularSection, 'points'>, parent: Room): Result<RectangularSection>
export function createRectangularSection(section: PartialPick<RectangularSection, 'points' | 'parent'>): Result<RectangularSection>
export function createRectangularSection(section: PartialPick<RectangularSection, 'points'>, parent?: Room): Result<RectangularSection> {
  if (!section.parent && !parent) {
    return fail('section:create:bad-parameters', 'Section must have a parent')
  }

  const [_parent, rest] = getParent(section, parent)

  return succeed({
    id: uid('rect'),
    shape: 'rectangle',
    parent: _parent,
    labelIds: [],
    __brand: 'Section',
    ...rest,
  })
}

export function createTriangularSection(section: PartialPick<TriangularSection, 'points'>, parent: Room): Result<TriangularSection>
export function createTriangularSection(section: PartialPick<TriangularSection, 'points' | 'parent'>): Result<TriangularSection>
export function createTriangularSection(section: PartialPick<TriangularSection, 'points'>, parent?: Room): Result<TriangularSection> {
  if (!section.parent && !parent) {
    return fail('section:create:bad-parameters', 'Section must have a parent')
  }

  const [_parent, rest] = getParent(section, parent)

  return succeed({
    id: uid('tri'),
    shape: 'triangle',
    parent: _parent,
    labelIds: [],
    __brand: 'Section',
    ...rest,
  })
}

export function createFixture(section: Partial<Fixture>, parent: Room): Result<Fixture>
export function createFixture(section: PartialPick<Fixture, 'parent'>): Result<Fixture>
export function createFixture(section: Partial<Fixture>, parent?: BaseFloorPlanEntity): Result<Fixture> {
  if (!section.parent && !parent) {
    return fail('fixture:create:bad-parameters', 'Fixture must have a parent')
  }

  const [_parent, rest] = getParent(section, parent)

  return succeed({
    id: uid('fix'),
    labelIds: [],
    parent: _parent,
    __brand: 'Fixture',
    ...rest
  })
}

export function createLabel(label: PartialPick<Label, 'text' | 'point'>, parent: Room): Result<Label>
export function createLabel(label: PartialPick<Label, 'text' | 'point' | 'parent'>): Result<Label>
export function createLabel(label: PartialPick<Label, 'text' | 'point'>, parent?: BaseFloorPlanEntity): Result<Label> {
  if (!label.parent && !parent) {
    return fail('fixture:create:bad-parameters', 'Fixture must have a parent')
  }

  const [_parent, rest] = getParent(label, parent)

  return succeed({
    id: uid('label'),
    parent: _parent,
    __brand: 'Label',
    ...rest
  })
}