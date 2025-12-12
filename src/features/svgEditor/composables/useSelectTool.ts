import type {EditorToolName} from "@editor/types/svgEditor.ts"
import {
  computed,
  type ComputedRef,
  type ModelRef,
  type Reactive,
  reactive,
  ref,
  type Ref,
  watch
} from "vue"
import type {Point} from "@editor/types/svgEditor.ts"
import {NamedError} from "@/features/error/utilities/errorHandling.ts"
import {getPointerPosition} from "@editor/utilities/points.ts"
import {brandedId} from "@/features/general/utilities/ids.ts"
import AppConfig from "@/app.config.ts"
import type {ToolbarButtonProps} from "@editor/types/toolbarButton.ts"
import {useDebug} from "@/features/development/composables/useDebug.ts"

const icons = AppConfig.ui.icons

type SelectToolPreview = {
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

export type CssClassObject = { [key: string]: boolean }
export type CssClasses = string | CssClassObject | Array<string | CssClassObject>

export interface ToolComposable {
  name: EditorToolName
  onEscape: () => void
  onPointerDown: (e: PointerEvent) => void
  onPointerMove: (e: PointerEvent, polygons: { id: string, points: Point[] }[]) => void
  onPointerUp: (e: PointerEvent, polygons: { id: string, points: Point[] }[]) => void
  preview: ComputedRef<SelectToolPreview>
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
  const { debugData } = useDebug()
  const toolName = 'select'
  const width = ref<number | null>(null)
  const height = ref<number | null>(null)
  const phase = ref<'idle' | 'armed' | 'dragging'>('idle')
  const point1 = ref<Point | null>(null)
  const point2 = ref<Point | null>(null)
  const tlX = ref<number | null>()
  const tlY = ref<number | null>()
  const clickThreshold = computed(() => 5 / scale.value)
  const selectedIds = reactive(new Set<string>())
  const candidateSelectedIds = reactive(new Set<string>())

  const isSelectMode = computed(() => activeToolName.value === 'select')
  const isTargetSelected = computed(() => Boolean(currentTargetId.value && selectedIds.has(currentTargetId.value) && !candidateSelectedIds.has(currentTargetId.value)))
  const selectionMethod = computed<'default' | 'add' | 'remove'>(() => {
    if (!isSelectMode.value || !isShiftDown.value) {
      return 'default'
    }

    if (!isTargetSelected.value || phase.value === 'dragging') {
      return 'add'
    }

    return 'remove'
  })

  const preview = computed(() => {
    return {
      visible: activeToolName.value === 'select'
        && (
          phase.value === 'armed'
          || phase.value === 'dragging'
        )
        && point1.value
        && width.value !== null
        && height.value !== null,
      x: tlX.value,
      y: tlY.value,
      width: width.value,
      height: height.value,
    } as SelectToolPreview
  })

  /**
   * # reset()
   * resets the phase and banding properties
   */
  const resetBoundingSquare = () => {
    phase.value = 'idle'
    tlX.value = null
    tlY.value = null
    width.value = null
    height.value = null
  }

  const checkInsideClickThreshold = (pointerPosition: Point) => {
    if (!point1.value) {
      throw new NamedError('tool:select:not-found', 'No start point found for select tool')
    }

    return Math.abs(pointerPosition.x - point1.value.x) < clickThreshold.value
      && Math.abs(pointerPosition.y - point1.value.y) < clickThreshold.value
  }

  const getSelectCandidates = (polygons: { id: string, points: Point[] }[]) => {
    if (phase.value === 'idle') {
      return
    }

    if (!polygons.length || !preview.value.visible) {
      candidateSelectedIds.clear()
      return
    }

    const filteredIds = polygons.filter(({ points }) => {
      return points.some(point => {
        return (
          point.x >= tlX.value! && point.x <= tlX.value! + width.value!
          && point.y >= tlY.value! && point.y <= tlY.value! + height.value!
        )
      })
    }).map(({ id }) => id)

    candidateSelectedIds.clear()
    for (const id of filteredIds) {
      candidateSelectedIds.add(id)
    }
  }

  const acceptSelectCandidates = () => {
    for (const id of candidateSelectedIds) {
      selectedIds.add(id)
    }

    candidateSelectedIds.clear()
  }

  const onSelect = (e: PointerEvent, id: string | null) => {
    resetBoundingSquare()
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

  const lastPointerAction = ref<'pointerDown' | 'pointerMove' | 'pointerUp' | null>(null)
  /**
   * # onPointerDown
   * @param e pointer event
   */
  const onPointerDown = (e: PointerEvent) => {
    if (phase.value !== 'idle') {
      return
    }

    phase.value = 'armed'
    point1.value = getPointerPosition(e, { x: panX.value, y: panY.value }, scale)
  }

  /**
   * # onPointerUp(e, polygons)
   * @param e pointer event
   * @param polygons list of polygons to select from
   */
  const onPointerUp = (e: PointerEvent, polygons: { id: string, points: Point[] }[]) => {
    if (phase.value === 'idle') {
      return
    }

    const pointerPosition = getPointerPosition(e, panX, panY, scale)

    if (!point1.value) {
      throw new NamedError('tool:select:not-found', 'No start point found for select tool')
    }

    if (checkInsideClickThreshold(pointerPosition)) {
      onSelect(e, currentTargetId.value)
      return
    }

    point2.value = pointerPosition
    getSelectCandidates(polygons)
    acceptSelectCandidates()
    resetBoundingSquare()
  }

  /**
   * # onPointerMove
   * @param e pointer event
   * @param polygons list of polygons to select from
   */
  const onPointerMove = (e: PointerEvent, polygons: { id: string, points: Point[] }[]) => {
    if (phase.value === 'idle') {
      return
    }

    if (phase.value === 'armed') {
      phase.value = 'dragging'
    }

    if (!point1.value) {
      throw new NamedError('tool:select:not-found', 'No start point found for select tool')
    }

    const pointerPosition = getPointerPosition(e, panX, panY, scale)
    tlX.value = Math.min(pointerPosition.x, point1.value.x)
    tlY.value = Math.min(pointerPosition.y, point1.value.y)
    width.value = Math.abs(pointerPosition.x - point1.value.x)
    height.value = Math.abs(pointerPosition.y - point1.value.y)

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
    resetBoundingSquare()
    selectedIds.clear()
  }

  watch(
    [
      classes,
      isShiftDown,
      phase,
      preview,
      selectedIds,
      candidateSelectedIds,
    ], (
      [
        _classes,
        _isShiftDown,
        _phase,
        _preview,
        _selectedIds,
        _tempSelectedIds,
      ],
    ) => {
    debugData.value.selectTool = {
      _isShiftDown,
      _phase,
      _preview,
      _selectedIds,
      _tempSelectedIds,
      _classes,
    }

  })

  watch(lastPointerAction, (val, old) => {
    if (old !== null) {
      console.groupEnd()
    }
    console.group(val)
  })

  return {
    classes,
    name: toolName,
    onEscape,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onSelect,
    preview,
    reset: resetBoundingSquare,
    selectedIds,
    candidateSelectedIds,
    toolbarButton,
  }
}