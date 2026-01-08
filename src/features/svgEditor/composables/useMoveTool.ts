import {computed, nextTick, type Reactive, ref, type Ref, watchEffect} from 'vue'
import type {EditorToolName} from '@editor/types/svgEditor.ts'
import {getPointerPosition} from '@editor/utilities/points.ts'
import {NamedError} from '@/features/error/utilities/errorHandling.ts'
import type {ConsumesPanProps} from '@editor/types/panTool.ts'
import type {SvgElementValues} from '@editor/types/svgElement.ts'
import {brandedId} from '@/features/general/utilities/ids.ts'
import AppConfig from '@/app.config.ts'
import type {ToolbarButtonProps} from '@editor/types/toolbarButton.ts'
import {round} from '@/features/general/utilities/maths.ts'

const icons = AppConfig.ui.icons

export const useMoveTool = (
  {
    activeToolName,
    currentTargetId,
    selectedIds,
    panX,
    panY,
    scale,
    elements,
  }: {
    activeToolName: Ref<EditorToolName | null>
    currentTargetId: Ref<string | null>
    selectedIds: Reactive<Set<string>>
    elements: Map<SvgElementValues['id'],SvgElementValues>
  } & ConsumesPanProps
) => {
  const toolName = 'move'

  const isActive = computed(() => activeToolName.value === toolName)
  const phase = ref<'idle' | 'active' | 'forced'>('idle')
  const canHover = computed(() => activeToolName.value === toolName)
  const anchorX = ref<number | null>()
  const anchorY = ref<number | null>()
  const diffX = ref<number | null>()
  const diffY = ref<number | null>()
  let hasSetId = false

  const updateMove = ((x: number | null, y: number | null) => {
    for (const id of selectedIds) {
      const element = elements.get(id)
      if (!element) {
        throw new Error(`No element found for id: '${id}' in elements.`)
      }

      if (x || y) {
        element.move = { x: x ?? 0, y: y ?? 0 }
      }
      else {
        console.log('resetting move:', id)
        element.move = null
      }
    }

    diffX.value = x
    diffY.value = y
  })

  const reset = () => {
    phase.value = 'idle'

    anchorX.value = null
    anchorY.value = null
    updateMove(null, null)


    if (hasSetId) {
      selectedIds.clear()
    }
    hasSetId = false
  }

  const classes = computed(() => ({
    '**:cursor-move': isActive.value,
  }))

  /**
   * # onPointerDown
   * @param e pointer event
   */
  const onPointerDown = (e: PointerEvent) => {
    if (phase.value !== 'idle') {
      return
    }

    hasSetId = false
    if (!selectedIds.size && currentTargetId.value) {
      selectedIds.add(currentTargetId.value)
      hasSetId = true
    }

    anchorX.value = round((e.offsetX + panX.value) * scale.value)
    anchorY.value = round((e.offsetY + panY.value) * scale.value)

    phase.value = 'active'
  }

  /**
   * # onPointerMove
   * @param e pointer event
   */
  const onPointerMove = (e: PointerEvent) => {
    if (phase.value === 'idle') {
      return
    }

    if (!anchorX.value || !anchorY.value) {
      throw new NamedError('tool:move:not-found', 'No anchor point found for move tool')
    }

    const { x, y } = getPointerPosition(e, panX, panY, scale)
    updateMove(round(x - anchorX.value), round(y - anchorY.value))
  }

  // const revertChanges = (element: SvgElementValues) => {
  //   element.move = null
  // }

  const acceptChanges = (element: SvgElementValues) => {
    for (const point of element.points) {
      point.x += diffX.value ?? 0
      point.y += diffY.value ?? 0
    }
  }

  /**
   * # onPointerUp()
   */
  const onPointerUp = () => {
    if (phase.value === 'idle') {
      return
    }

    for (const id of selectedIds) {
      const element = elements.get(id)

      if (!element) {
        throw new Error(`No element found for id: '${id}' in elements.`)
      }

      acceptChanges(element)
      debugData.value.moveTool[id] = element.points
    }

    nextTick().then(() => reset())
  }

  const toolbarButton: ToolbarButtonProps = {
    id: brandedId(toolName),
    toolName,
    label: 'Move',
    icon: icons.moveTool,
    kbds: ['m'],
    onClick: () => activeToolName.value = toolName,
  }

  const { debugData } = useDebug()
  watchEffect(() => {
    debugData.value.moveTool = {
      phase: phase.value,
      anchorX: anchorX.value,
      anchorY: anchorY.value,
      diffX: diffX.value,
      diffY: diffY.value,
    }
  })

  return {
    canHover,
    classes,
    name: toolName,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    toolbarButton,
  }
}