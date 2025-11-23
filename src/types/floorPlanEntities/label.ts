import type {BaseFloorPlanEntity, EntityType} from "@/types/floorPlanEntities/floorPlan.ts";
import type {Point} from "@/types/svgEditor.ts";

export type LabelId = string & { __brand: 'LabelId' }

export interface Label extends BaseFloorPlanEntity {
  id: LabelId
  point: Point
  parent: {
    id: string
    type: EntityType
  }
  text: string
  __brand: 'Label'
}

export function isLabel(entity: BaseFloorPlanEntity): entity is Label {
  return entity.__brand === 'Label'
}