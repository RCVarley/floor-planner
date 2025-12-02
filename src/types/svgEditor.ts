import type {EntityStub, EntityTypeName} from "@/types/floorPlanEntities/floorPlan.ts";

export interface Point {
  x: number
  y: number
}

export type ToolName = 'pan' | 'move' | 'select' | 'text' | 'draw'
export type EditorDrawMode = 'rectangle' | 'triangle' | 'polygon' | 'point'
export type EditorActiveEntity<TypeName extends EntityTypeName = EntityTypeName> = EntityStub<TypeName>
export type EditorSelectedEntity<TypeName extends EntityTypeName = EntityTypeName> = EntityStub<TypeName>