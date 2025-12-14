import type {
  FloorPlan, FloorPlanEntity, EntityStub, BaseFloorPlanEntity, EntityTypeName
} from "@floor-plan/types/floorPlan.ts"
import {uid} from "@/features/general/utilities/ids.ts"
import type {PartialPick} from "@/features/general/types/utilities.ts"
import {fail, type Result, succeed, type Success} from "@/features/error/utilities/errorHandling.ts"
import {type Building} from "@floor-plan/types/building.ts"
import type {Floor} from "@floor-plan/types/floor.ts"
import type {Room} from "@floor-plan/types/room.ts"
import type {PolygonalSection, RectangularSection, TriangularSection} from "@floor-plan/types/section.ts"
import type {Fixture} from "@floor-plan/types/fixture.ts"
import type {Label} from "@floor-plan/types/label.ts"

function createParent<ParentEntityType extends BaseFloorPlanEntity, ParentEntityTypeName extends EntityTypeName>(entity: ParentEntityType | undefined, parentEntityTypeName: ParentEntityTypeName): EntityStub<ParentEntityTypeName> | null {
  if (!entity) {
    return null
  }

  return {
    id: entity.id,
    type: parentEntityTypeName,
  }
}

export function createPlan(FloorPlan: Partial<FloorPlan> = {}): Success<FloorPlan> {
  return succeed({
    id: uid('plan'),
    name: 'Plan name',
    buildings: [],
    floors: [],
    rooms: [],
    sections: [],
    fixtures: [],
    labels: [],
    __brand: 'FloorPlan',
    ...FloorPlan
  })
}

function getParent<
  ParentEntityTypeName extends EntityTypeName,
  EType extends Partial<FloorPlanEntity<ParentEntityTypeName>>,
  ParentEntityType extends BaseFloorPlanEntity
>(
  parentType: ParentEntityTypeName,
  entity: EType,
  parentEntity?: ParentEntityType
): [parent: EntityStub<ParentEntityTypeName> | null, rest: Omit<EType, 'parent'>] {
  const { parent, ...rest } = entity
  return [
    parent ?? createParent(parentEntity, parentType),
    rest
  ]
}

export function createBuilding(building: PartialPick<Building, 'points'>, parent?: Building): Result<Building> {
  const [_parent, rest] = getParent('Building', building, parent)

  const result: Building = {
    id: uid('build'),
    wallType: null,
    parent: _parent,
    floorIds: [],
    labelIds: [],
    __brand: 'Building',
    ...rest,
  }
  return succeed(result)
}

export function createFloor(floor: PartialPick<Floor, 'points'>, parent: Building): Result<Floor>
export function createFloor(floor: PartialPick<Floor, 'points' | 'parent'>): Result<Floor>
export function createFloor(floor: PartialPick<Floor, 'points'>, parent?: Building): Result<Floor> {
  if (!floor.parent && !parent) {
    return fail('floor:create:bad-parameters', 'Floor must have a parent')
  }

  const [_parent, rest] = getParent('Building', floor, parent)

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
export function createRoom(room: PartialPick<Room, 'sectionIds'>): Result<Room>
export function createRoom(room: PartialPick<Room, 'sectionIds'>, parent?: Floor): Result<Room> {
  if (!room.sectionIds.length) {
    return fail('room:create:bad-parameters', 'Room must have at least one section')
  }

  const [_parent, rest] = getParent('Floor', room, parent)

  return succeed({
    id: uid('room'),
    heightM: null,
    parent: _parent,
    points: [],
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

  const [_parent, rest] = getParent('Room', section, parent)

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

  if (section.points.length !== 4) {
    return fail('section:create:bad-parameters', 'Rectangular section must contain 4 points.')
  }

  const [_parent, rest] = getParent('Room', section, parent)

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

  const [_parent, rest] = getParent('Room', section, parent)

  return succeed({
    id: uid('tri'),
    shape: 'triangle',
    parent: _parent,
    labelIds: [],
    __brand: 'Section',
    ...rest,
  })
}

export function createFixture(section: PartialPick<Fixture, 'points'>, parent: Room): Result<Fixture>
export function createFixture(section: PartialPick<Fixture, 'points' | 'parent'>): Result<Fixture>
export function createFixture(section: PartialPick<Fixture, 'points'>, parent?: BaseFloorPlanEntity): Result<Fixture> {
  if (!section.parent && !parent) {
    return fail('fixture:create:bad-parameters', 'Fixture must have a parent')
  }

  const [_parent, rest] = getParent('Room', section, parent)

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

  const [_parent, rest] = getParent((label.parent?.type || parent?.__brand)! as EntityTypeName, label, parent)

  return succeed({
    id: uid('label'),
    parent: _parent,
    __brand: 'Label',
    ...rest
  })
}