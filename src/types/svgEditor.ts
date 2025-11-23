export interface Point {
  x: number
  y: number
}

export type EditorMode = 'pan' | 'move' | 'select' | 'text' | 'draw'
export type EditorDrawMode = 'rectangle' | 'triangle' | 'polygon'