export interface Point {
  x: number
  y: number
}

export type EditorToolName = ('pan' | 'move' | 'select' | 'text' | 'draw' | 'rectangle') & string
export type EditorDrawMode = 'rectangle'// | 'triangle' | 'polygon' | 'point'
export interface SvgEditorCoreProps {
  pointerDown: boolean
  panX: number
  panY: number
  scale: number
  activeToolName: EditorToolName
}

export interface EditorRibbonProps extends SvgEditorCoreProps {
  isShowingPropertiesPanel: boolean
}

export interface SvgEditorProps extends Omit<SvgEditorCoreProps, 'activeToolName'> {}

// import type {EntityStub, EntityTypeName} from "@floor-plan/types/floorPlan.ts"
// export type EditorActiveEntity<TypeName extends EntityTypeName = EntityTypeName> = EntityStub<TypeName>
// export type EditorSelectedEntity<TypeName extends EntityTypeName = EntityTypeName> = EntityStub<TypeName>