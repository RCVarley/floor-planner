import type {CanMove} from '@editor/types/moveTool.ts'
import type {Point} from '@editor/types/svgEditor.ts'

export interface SvgElementValues extends CanMove {
  id: string
  points: Point[]
  // minX: MaybeRef<number | null>
  // maxX: MaybeRef<number | null>
  // minY: MaybeRef<number | null>
  // maxY: MaybeRef<number | null>
}

export type SvgElementMap = Map<SvgElementValues['id'], SvgElementValues>