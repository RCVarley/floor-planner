import type {EditorToolName} from '@editor/types/svgEditor.ts'
import {computed, type Ref} from 'vue'
import {getPointerPosition} from '@editor/utilities/points.ts'
import type {ConsumesPanProps} from '@editor/types/panTool.ts'
import type {SvgElementValues} from '@editor/types/svgElement.ts'
import {brandedId, uid} from '@/features/general/utilities/ids.ts'
import type {ToolbarButtonProps} from '@editor/types/toolbarButton.ts'
import AppConfig from '@/app.config.ts'
const icons = AppConfig.ui.icons

export const useRectangleTool = (
  {
    activeToolName,
    panX,
    panY,
    scale,
    elements,
  }: {
    activeToolName: Ref<EditorToolName | null>
    elements: Map<SvgElementValues['id'],SvgElementValues>
  } & ConsumesPanProps
) => {
  const toolName = 'rectangle'

  const editorPreview = useEditorPreview(toolName, activeToolName)

  const toolbarButton: ToolbarButtonProps = {
    id: brandedId('rectangle'),
    label: 'Rectangle',
    toolName,
    kbds: ['r'],
    icon: icons.rectangle,
    onClick: () => activeToolName.value = toolName,
  }

  /**
   * # onPointerDown
   * @param e pointer event
   */
  const onPointerDown = (e: PointerEvent) => {
    if (editorPreview.phase.value !== 'idle') {
      return
    }

    editorPreview.phase.value = 'armed'
    editorPreview.anchorPoint.value = getPointerPosition(e, { x: panX.value, y: panY.value }, scale)
  }

  /**
   * # onPointerMove
   * @param e pointer event
   */
  const onPointerMove = (e: PointerEvent) => {
    if (activeToolName.value !== toolName || editorPreview.phase.value === 'idle') {
      return
    }

    if (editorPreview.phase.value === 'armed') {
      editorPreview.phase.value = 'dragging'
    }

    editorPreview.redraw(getPointerPosition(e, panX, panY, scale))
  }

  /**
   * # onPointerUp(e, polygons)
   * @param _e pointer event
   */
  const onPointerUp = (_e: PointerEvent) => {
    if (editorPreview.phase.value === 'idle') {
      return
    }

    const { error, data } = editorPreview.toPolygon()

    if (error) {
      throw error
    }

    const id = uid('rect')
    elements.set(id, {
      id,
      points: data,
      move: null
    })

    editorPreview.reset()
  }

  /**
   * # onEscape
   */
  const onEscape = () => {
    editorPreview.reset()
  }

  const classes = computed(() => ({
    '**:cursor-crosshair': activeToolName.value === toolName,
  }))

  return {
    classes,
    name: toolName,
    onEscape,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    preview: editorPreview.preview,
    toolbarButton,
  }
}