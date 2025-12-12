import {computed, type ComputedRef, type ModelRef, ref, type Ref} from "vue"
import {extractShortcuts, useExtendedShortcuts} from "@editor/composables/useShortcuts.ts"
import type {EditorToolName, Point} from "@editor/types/svgEditor.ts"
import {round} from "@/features/general/utilities/maths.ts"
import type {ToolbarButtonGroup} from "@editor/types/toolbarButton.ts"

export const useEditorControls = <EntityType extends { id: string, __brand: string }>(
  {
    mode,
    pan,
    scale,
    mousePosition,
    onClick,
    toolbarGroups,
  }: {
    mode: Ref<EditorToolName>
    pan: ModelRef<Point>
    scale: ModelRef<number>
    mousePosition: Ref<Point | null>
    toolbarGroups: ComputedRef<ToolbarButtonGroup[]>
    onClick?: (e?: MouseEvent) => void
  }) => {
  const forcePan = ref(false)
  const mouseDown = ref(false)
  const isMouseDown = computed(() => forcePan.value || mouseDown.value)

  let modeStorage: EditorToolName | null = null
  useExtendedShortcuts({
    ...extractShortcuts(toolbarGroups),
    ' ': {
      keydown: () => {
        if (mode.value !== 'pan') {
          modeStorage = mode.value
        }

        mode.value = 'pan'
        forcePan.value = true
      },
      keyup: () => {
        if (mode.value === 'pan' && modeStorage) {
          mode.value = modeStorage
          modeStorage = null
        }
        forcePan.value = false
      },
    },
    'esc': () => mode.value = 'select',
  })

  function handleMouseMove(
    {
      movementX,
      movementY,
      offsetX,
      offsetY,
    }: MouseEvent
  ) {
    mousePosition.value = {
      x: Math.round((offsetX + pan.value.x) / scale.value),
      y: Math.round((offsetY + pan.value.y) / scale.value)
    }

    if (mode.value === 'pan' && isMouseDown.value) {
      pan.value.x += movementX * -1
      pan.value.y += movementY * -1
    }
  }

  function zoom(deltaY: number) {
    const result = scale.value - deltaY * 0.01
    if (result < 0.1) {
      scale.value = 0.1
      return
    }

    if (result > 3) {
      scale.value = 3
      return
    }


    scale.value = round(result, 2)
  }

  function handleWheel({ deltaY, deltaX, ctrlKey, altKey, metaKey, shiftKey }: WheelEvent) {
    if (ctrlKey || altKey || metaKey || shiftKey) {
      zoom(deltaY)
    } else {
      pan.value.x += deltaX * -1
      pan.value.y += deltaY * -1
    }
  }

  const viewTransform = computed(
    () => `translate(${pan.value.x * -1},${pan.value.y * -1}) scale(${scale.value})`
  )

  const handleMouseDown = (_e: MouseEvent) => {
    mouseDown.value = true
  }

  const handleMouseUp = (_e: MouseEvent) => {
    mouseDown.value = false
  }

  const handleClick = (e: MouseEvent) => {
    console.group('handleClick')
    if (onClick) {
      onClick(e)
    }
    console.groupEnd()
  }
  // const activeEntity = ref<EditorActiveEntity | null>(null)

  const handleHover = (_entity: EntityType) => {
    // activeEntity.value = {
    //   id: entity.id,
    //   type: entity.__brand
    // }
  }

  return {
    handleWheel,
    handleMouseMove,
    viewTransform,
    zoom,
    mousePosition,
    isMouseDown,
    handleMouseDown,
    handleMouseUp,
    handleHover,
    handleClick,
  }
}