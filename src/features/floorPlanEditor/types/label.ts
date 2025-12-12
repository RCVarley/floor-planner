import type {BaseFloorPlanEntity, EntityStub, EntityTypeName} from "@floor-plan/types/floorPlan.ts"
import type {Point} from "@editor/types/svgEditor.ts"

export type LabelId = string & { __brand: 'LabelId' }

export interface Label extends BaseFloorPlanEntity {
  id: LabelId
  point: Point
  parent: EntityStub<EntityTypeName> | null
  text: string
  __brand: 'Label'
}

export function isLabel(entity: BaseFloorPlanEntity): entity is Label {
  return entity.__brand === 'Label'
}