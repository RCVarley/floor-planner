<script setup lang="ts">
import {computed, ref} from "vue"
import type {EditorToolName, Point, SvgEditorProps} from "@editor/types/svgEditor.ts"
import AppConfig from "@/app.config.ts"
import {getPointerPosition} from "@editor/utilities/points.ts"
import {useSelectTool} from "@editor/composables/useSelectTool.ts"
import type {ToolbarButtonGroup} from "@editor/types/toolbarButton.ts"
import {brandedId} from "@/features/general/utilities/ids.ts"

defineProps<Partial<SvgEditorProps>>()

const panX = defineModel<number>('panX', { default: 0 })
const panY = defineModel<number>('panY', { default: 0 })
const scale = defineModel<number>('zoom', { default: 1 })
const snap = defineModel<boolean>('snap', { default: false })

const icons = AppConfig.ui.icons

const activeToolName = ref<EditorToolName>('select')
const currentTargetId = ref<string|null>(null)
const isShiftDown = ref(false)

const { selectedIds, candidateSelectedIds, ...selectTool } = useSelectTool({
  activeToolName,
  currentTargetId,
  isShiftDown,
  panX,
  panY,
  scale,
})

useExtendedShortcuts({
  'escape': () => {
    switch(activeToolName.value) {
      case selectTool.name:
        selectTool.onEscape()
        break
    }
  },
  'shift': {
    keydown: () => isShiftDown.value = true,
    keyup: () => isShiftDown.value = false,
  }
})

// const nodeRadius = computed(() => 8 / (scale.value))
const pointerPosition = ref<Point | null>(null)
const pointerDown = ref(false)
const forcePointerDown = ref(false)
const isPointerDown = computed(() => pointerDown.value || forcePointerDown.value)
function onPointerMove(e: PointerEvent) {
  pointerPosition.value = getPointerPosition(e, panX, panY, scale)

  if (activeToolName.value === 'pan' && isPointerDown.value) {
    panX.value += e.movementX * -1
    panY.value += e.movementY * -1
  }

  switch(activeToolName.value) {
    case selectTool.name:
      selectTool.onPointerMove(e, polygons.value)
      break
  }
}

function onPointerDown(e: PointerEvent) {
  pointerDown.value = true

  switch(activeToolName.value) {
    case selectTool.name:
      selectTool.onPointerDown(e)
      break
  }
}

function onPointerUp(e: PointerEvent) {
  pointerDown.value = false

  switch(activeToolName.value) {
    case selectTool.name:
      selectTool.onPointerUp(e)
      break
  }
}

function onPointerOver(_e: PointerEvent, id: string) {
  currentTargetId.value = id
}

function onPointerOut(_e: PointerEvent, id: string) {
  if (currentTargetId.value !== id) return

  currentTargetId.value = null
}

function onPointerLeave(_e: PointerEvent) {
  pointerPosition.value = null
}

const showPropertiesPanel = ref(false)
const isShowingPropertiesPanel = computed(() => showPropertiesPanel.value)

const toolbarGroups = computed<ToolbarButtonGroup[]>(() => ([
  {
    id: brandedId('general'),
    name: 'General',
    buttons: [
      selectTool.toolbarButton
    ],
  }
]))

type Polygon = { id: string, points: Point[] }
const polygons = ref<Polygon[]>([
  {
    id: 'square',
    points: [
      { x: 80, y: 80 },
      { x: 120, y: 80 },
      { x: 120, y: 120 },
      { x: 80, y: 120 },
    ]
  },
  {
    id: 'rect',
    points: [
      { x: 100, y: 100 },
      { x: 220, y: 100 },
      { x: 220, y: 220 },
      { x: 100, y: 220 },
    ]
  },
])
</script>

<template>
<div class="floor-plan-editor grow grid grid-cols-[auto_1fr_auto] grid-rows-[auto_1fr] gap-4">
  <EditorRibbon
    v-model:scale="scale"
    v-model:pan-x="panX"
    v-model:pan-y="panY"
    :active-tool-name
    :pointer-down
    :is-showing-properties-panel
    @toggle-properties-panel="showPropertiesPanel = !showPropertiesPanel"
  />
  <EditorToolbar
    :groups="toolbarGroups"
    :active-tool-name
    class="col-start-1"
  />
  <SvgEditorCore
    :pan-x
    :pan-y
    :snap
    :scale
    :active-tool-name
    :zoom="scale"
    :pointer-down="isPointerDown"
    :class="[
      showPropertiesPanel ? 'col-span-1' : 'col-span-2',
      selectTool.classes.value,
    ]"
    @pointerdown="onPointerDown"
    @pointerup="onPointerUp"
    @pointerleave="onPointerLeave"
    @pointermove="onPointerMove"
  >
    <template #banding>
      <rect
        v-if="selectTool.preview.value.visible"
        :x="selectTool.preview.value.x"
        :y="selectTool.preview.value.y"
        :width="selectTool.preview.value.width"
        :height="selectTool.preview.value.height"
        class="fill-black/10 stroke-black-2"
      />

<!--      <line-->
<!--        v-if="cursorLine"-->
<!--        :x1="cursorLine.x1"-->
<!--        :y1="cursorLine.y1"-->

<!--        :x2="cursorLine.x2"-->
<!--        :y2="cursorLine.y2"-->
<!--      />-->
    </template>
    <template #default>
      <SvgPolygon
        v-for="polygon in polygons"
        :key="polygon.id"
        :id="polygon.id"
        :points="polygon.points"
        class="stroke-5 stroke-black/60 fill-transparent"
        :class="{
          '!stroke-red-500': selectedIds.has(polygon.id) || candidateSelectedIds.has(polygon.id),
          '!stroke-black': currentTargetId === polygon.id,
        }"
        @pointerover="onPointerOver($event, polygon.id)"
        @pointerout="onPointerOut($event, polygon.id)"
      />
    </template>
  </SvgEditorCore>
  <UCard
    v-if="isShowingPropertiesPanel"
    class="col-start-3 row-start-1 row-span-2 mt-0.5"
    :ui="{
        header: 'flex gap-4 items-center',
      }"
  >
    <template #header>
      <UButton
        :active="!isShowingPropertiesPanel"
        variant="subtle"
        active-variant="solid"
        :icon="icons.panelClose"
        aria-label="Properties"
        class="ml-auto self-end"
        :ui="{
            leadingIcon: 'rotate-180'
          }"
        square
        @click="showPropertiesPanel = !showPropertiesPanel"
      />
      <h2>Properties</h2>
    </template>
    <template #default>
<!--      <pre>{{ selectedEntity }}</pre>-->
    </template>
  </UCard>
</div>
</template>

<style scoped>

</style>