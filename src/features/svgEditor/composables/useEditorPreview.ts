import {computed, type Ref, ref} from "vue"
import type {Point} from "@editor/types/svgEditor.ts";
import {fail, type Result, succeed} from "@/features/error/utilities/errorHandling.ts";
import {extrapolateRectanglePolygon, type RectanglePolygonPoints} from '@editor/utilities/points.ts'

export type RectanglePreview = {
  visible: true
  x: number
  y: number
  width: number
  height: number
} | {
  visible: false
  x: number | null
  y: number | null
  width: number | null
  height: number | null
}

export type PreviewPhase = 'idle' | 'armed' | 'dragging'

export const useEditorPreview = (toolName: string, activeToolName: Ref<string | null>) => {
  const phase = ref<PreviewPhase>('idle')
  const width = ref<number | null>(null)
  const height = ref<number | null>(null)
  const tlX = ref<number | null>(null)
  const tlY = ref<number | null>(null)

  const checkIfPointIsInside = ({ x, y }: Point) => {
    return x >= tlX.value! && x <= tlX.value! + width.value!
      && y >= tlY.value! && y <= tlY.value! + height.value!
  }

  const anchorPoint = ref<Point | null>(null)

  const redraw = (pointerPosition: Point) => {
    if (!anchorPoint.value) {
      return fail('preview:create:not-found', 'anchor point is not set')
    }

    tlX.value = Math.min(pointerPosition.x, anchorPoint.value.x)
    tlY.value = Math.min(pointerPosition.y, anchorPoint.value.y)
    width.value = Math.abs(pointerPosition.x - anchorPoint.value.x)
    height.value = Math.abs(pointerPosition.y - anchorPoint.value.y)
  }

  const preview = computed(() => {
    return {
      visible: activeToolName.value === toolName
        && width.value !== null
        && height.value !== null
        && anchorPoint.value !== null
        && (
          phase.value === 'armed'
          || phase.value === 'dragging'
        ),
      x: tlX.value,
      y: tlY.value,
      width: width.value,
      height: height.value,
    } as RectanglePreview
  })

  /**
   * # reset()
   * resets the phase and banding properties
   */
  const reset = () => {
    phase.value = 'idle'
    tlX.value = null
    tlY.value = null
    width.value = null
    height.value = null
  }

  const toPolygon = (): Result<RectanglePolygonPoints> => {
    if (tlX.value === null || tlY.value === null || width.value === null || height.value === null) {
      return fail('preview:create:bad-parameters', 'anchor point is not set')
    }

    return succeed(extrapolateRectanglePolygon(tlX.value, tlY.value, width.value, height.value))
  }

  return {
    anchorPoint,
    checkIfPointIsInside,
    phase,
    preview,
    redraw,
    reset,
    toPolygon,
  }
}