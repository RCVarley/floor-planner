import type {MaybeRef} from "vue";

export interface SvgElementValues {
  id: string
  points: MaybeRef<number[]>
  minX: MaybeRef<number | null>
  maxX: MaybeRef<number | null>
  minY: MaybeRef<number | null>
  maxY: MaybeRef<number | null>
}