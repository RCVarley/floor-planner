import {computed, ref} from "vue"
import type {ToolbarButtonProps} from "@editor/types/toolbarButton.ts"
import {brandedId} from "@/features/general/utilities/ids.ts"
import AppConfig from "@/app.config.ts"
import type {UsePanToolProps} from '@editor/types/panTool.ts'

const icons = AppConfig.ui.icons

export const usePanTool = (
  {
    activeToolName,
    panX,
    panY,
  }: UsePanToolProps
) => {
  const toolName = 'pan'
  const isActive = computed(() => activeToolName.value === toolName)

  const phase = ref<'idle' | 'active' | 'forced'>('idle')

  const toolbarButton: ToolbarButtonProps = {
    id: brandedId(toolName),
    label: 'Pan',
    toolName,
    kbds: ['p'],
    icon: icons.panTool,
    onClick: () => activeToolName.value = 'pan',

  }

  let swappedTool: string | null = null
  const shortcuts = {
    ' ': {
      keydown: () => {
        phase.value = 'forced'
        if (isActive.value) {
          return
        }

        swappedTool = activeToolName.value
        activeToolName.value = toolName
      },
      keyup: () => {
        phase.value = 'idle'
        if (!swappedTool) {
          return
        }

        activeToolName.value = swappedTool
        swappedTool = null
      },
    }
  }

  const onPointerDown = () => {
    if (phase.value === 'forced') {
      return
    }
    phase.value = 'active'
  }

  const onPointerMove = (e: PointerEvent) => {
    if (phase.value === 'active' || phase.value === 'forced') {
      panX.value += e.movementX * -1
      panY.value += e.movementY * -1
    }
  }

  const onPointerUp = () => {
    if (phase.value === 'forced') {
      return
    }
    phase.value = 'idle'
  }

  const classes = computed(() => ({
    '**:cursor-grab': isActive.value && phase.value === 'idle',
    '**:cursor-grabbing': isActive.value && phase.value !== 'idle',
  }))

  return {
    classes,
    name: toolName,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    shortcuts,
    toolbarButton,
  }
}