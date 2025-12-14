import type {EditorToolName} from "@editor/types/svgEditor.ts"
import {
  computed,
  type ComputedRef,
  type ModelRef,
  type Reactive,
  reactive,
  type Ref,
} from "vue"
import type {Point} from "@editor/types/svgEditor.ts"
import {NamedError} from "@/features/error/utilities/errorHandling.ts"
import {getPointerPosition} from "@editor/utilities/points.ts"
import {brandedId} from "@/features/general/utilities/ids.ts"
import AppConfig from "@/app.config.ts"
import type {ToolbarButtonProps} from "@editor/types/toolbarButton.ts"
import {type RectanglePreview, useEditorPreview} from "@editor/composables/useEditorPreview.ts";
import type {CssClasses} from "@/features/general/types/vueHelperTypes.ts";

const icons = AppConfig.ui.icons

export interface ToolComposable {
  name: EditorToolName
  onEscape: () => void
  onPointerDown: (e: PointerEvent) => void
  onPointerMove: (e: PointerEvent, polygons: { id: string, points: Point[] }[]) => void
  onPointerUp: (e: PointerEvent) => void
  preview: ComputedRef<RectanglePreview>
  reset: () => void
  selectedIds: Reactive<Set<string>>
  candidateSelectedIds: Reactive<Set<string>>
  onSelect: (e: PointerEvent, id: string) => void
  toolbarButton: ToolbarButtonProps
  classes: ComputedRef<CssClasses>
}

export const useSelectTool = (
  {
    activeToolName,
    currentTargetId,
    isShiftDown,
    panX,
    panY,
    scale,
  }: {

    activeToolName: Ref<EditorToolName | null>
    currentTargetId: Ref<string | null>
    isShiftDown: Ref<boolean>
    panX: Ref<number> | ModelRef<number>
    panY: Ref<number> | ModelRef<number>
    scale: Ref<number> | ModelRef<number>
  }): ToolComposable => {
  const toolName = 'select'
  const clickThreshold = computed(() => 5 / scale.value)
  const selectedIds = reactive(new Set<string>())
  const candidateSelectedIds = reactive(new Set<string>())

  const isSelectMode = computed(() => activeToolName.value === 'select')
  const isTargetSelected = computed(() => Boolean(currentTargetId.value && selectedIds.has(currentTargetId.value) && !candidateSelectedIds.has(currentTargetId.value)))
  const selectionMethod = computed<'default' | 'add' | 'remove'>(() => {
    if (!isSelectMode.value || !isShiftDown.value) {
      return 'default'
    }

    if (!isTargetSelected.value || editorPreview.phase.value === 'dragging') {
      return 'add'
    }

    return 'remove'
  })
  const editorPreview = useEditorPreview(toolName, activeToolName)

  const checkInsideClickThreshold = (pointerPosition: Point) => {
    if (!editorPreview.anchorPoint.value) {
      throw new NamedError('tool:select:not-found', 'No start point found for select tool')
    }

    return Math.abs(pointerPosition.x - editorPreview.anchorPoint.value.x) < clickThreshold.value
      && Math.abs(pointerPosition.y - editorPreview.anchorPoint.value.y) < clickThreshold.value
  }

  const getSelectCandidates = (polygons: { id: string, points: Point[] }[]) => {
    if (editorPreview.phase.value === 'idle') {
      return
    }

    if (!polygons.length || !editorPreview.preview.value.visible) {
      candidateSelectedIds.clear()
      return
    }

    candidateSelectedIds.clear()
    for (const polygon of polygons) {
      if (polygon.points.some(point => editorPreview.checkIfPointIsInside(point)))
        candidateSelectedIds.add(polygon.id)
    }
  }

  const acceptSelectCandidates = () => {
    for (const id of candidateSelectedIds) {
      selectedIds.add(id)
    }

    candidateSelectedIds.clear()
  }

  const onSelect = (e: PointerEvent, id: string | null) => {
    editorPreview.reset()
    if (id === null) {
      selectedIds.clear()
      return
    }

    if (!e.shiftKey) {
      selectedIds.clear()
      selectedIds.add(id)
      return
    }

    if (selectedIds.has(id)) {
      selectedIds.delete(id)
      return
    }

    selectedIds.add(id)
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
   * # onPointerUp(e, polygons)
   * @param e pointer event
   */
  const onPointerUp = (e: PointerEvent) => {
    if (editorPreview.phase.value === 'idle') {
      return
    }

    const pointerPosition = getPointerPosition(e, panX, panY, scale)

    if (!editorPreview.anchorPoint.value) {
      throw new NamedError('tool:select:not-found', 'No start point found for select tool')
    }

    if (checkInsideClickThreshold(pointerPosition)) {
      onSelect(e, currentTargetId.value)
      return
    }

    acceptSelectCandidates()
    editorPreview.reset()
  }

  /**
   * # onPointerMove
   * @param e pointer event
   * @param polygons list of polygons to select from
   */
  const onPointerMove = (e: PointerEvent, polygons: { id: string, points: Point[] }[]) => {
    if (activeToolName.value !== toolName || editorPreview.phase.value === 'idle') {
      return
    }

    if (editorPreview.phase.value === 'armed') {
      editorPreview.phase.value = 'dragging'
    }

    editorPreview.redraw(getPointerPosition(e, panX, panY, scale))

    if (selectionMethod.value === 'default') {
      selectedIds.clear()
    }
    getSelectCandidates(polygons)
  }

  const toolbarButton: ToolbarButtonProps = {
    id: brandedId('select'),
    label: 'Select',
    toolName,
    kbds: ['s'],
    icon: icons.selectTool,
    onClick: () => activeToolName.value = 'select',
  }

  const classes = computed<CssClasses>(() => ({
    'cursor-select': selectionMethod.value === 'default',
    'cursor-select--add': selectionMethod.value === 'add',
    'cursor-select--remove': selectionMethod.value === 'remove',
  }))

  const onEscape = () => {
    editorPreview.reset()
    selectedIds.clear()
  }

  return {
    classes,
    name: toolName,
    onEscape,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onSelect,
    preview: editorPreview.preview,
    reset: editorPreview.reset,
    selectedIds,
    candidateSelectedIds,
    toolbarButton,
  }
}