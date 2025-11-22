<script setup lang="ts">
import {computed, ref, unref, provide, readonly, useTemplateRef, type Reactive, watch} from "vue"
import type {Room, Point} from "@/types/floorPlan.ts"
import {brandedId} from "@/utils/ids.ts"
import RoomPlan from "@/components/floorPlanEditor/RoomPlan.vue"
import appConfig from "@/app.config.ts";
import {extractShortcuts, useExtendedShortcuts} from "@/composables/useShortcuts.ts"
import type {ToolbarButtonProps} from "@/types/toolbarButton.ts"
import {useDebug} from "@/composables/useDebug.ts"
import {createRoom} from "@/utils/floorPlan.ts";
import {round} from "@/utils/maths.ts";

const rooms = defineModel<Reactive<Room[]>>({ required: true })
const pan = defineModel<Point>('pan', { default: { x: 0, y: 0 } })
const scale = defineModel<number>('zoom', { default: 1 })
const snap = defineModel<boolean>('snap', { default: false })

const ppm = ref(100) // px per meter
const gridSize = computed(() => ppm.value)
const gridExtent = 10000

provide('editorScale', scale)
provide('editorPan', pan)

const icons = appConfig.ui.icons

const svg = useTemplateRef('floorPlanEditorSvgRef')
provide('editorSvg', svg)

export type EditorMode = 'pan' | 'move' | 'select' | 'text'
const mode = ref<EditorMode>('move')
provide('editorMode', readonly(mode))
let modeStorage: EditorMode | null = null
const mouseDown = ref(false)
const forcePan = ref(false)
const isMouseDown = computed(() => forcePan.value || mouseDown.value)

const _editorButtons: ToolbarButtonProps[][] = [
  [
    {
      id: brandedId('pan'),
      label: 'Pan',
      icon: icons.hand,
      kbds: ['p'],
      active: computed(() => mode.value === 'pan'),
      onClick: () => mode.value = 'pan',
    },
    {
      id: brandedId('move'),
      label: 'Move',
      icon: icons.move,
      kbds: ['m'],
      active: computed(() => mode.value === 'move'),
      onClick: () => mode.value = 'move',
    },
    {
      id: brandedId('Select'),
      label: 'Select',
      kbds: ['s'],
      icon: icons.cursor,
      active: computed(() => mode.value === 'select'),
      onClick: () => mode.value = 'select',
    },
    {
      id: brandedId('Text'),
      label: 'Text',
      kbds: ['t'],
      icon: icons.text,
      active: computed(() => mode.value === 'text'),
      onClick: () => mode.value = 'text',
    },
  ],
  [
    {
      id: brandedId('Rectangle'),
      label: 'Rectangle',
      kbds: ['r'],
      icon: icons.rectangle,
      onClick: () => rooms.value.push(createRoom()),
      hidden: false,
    }
  ]
]

const editorButtons = _editorButtons
  .map((group) => group.filter((button) => !unref(button.hidden)))
  .filter(group => !!group.length)


useExtendedShortcuts({
  ...extractShortcuts(editorButtons),
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
  }
})

// const mouseCollection = ref<{
//   topLeft: Partial<MouseEvent> | null
//   topMid: Partial<MouseEvent> | null
//   topRight: Partial<MouseEvent> | null
// }>({ topLeft: null, topMid: null, topRight: null})

// const mouseCollectMode = ref<keyof UnwrapRef<typeof mouseCollection> | null>(null)
const mousePosition = ref<Point | null>(null)
const { debugData } = useDebug()

function handleMouseMove(
  {
    movementX,
    movementY,
    offsetX,
    offsetY,
  }: MouseEvent
) {
  // if (mouseCollectMode.value) {
  //   mouseCollection.value[mouseCollectMode.value] = {
  //     movementX,
  //     movementY,
  //     offsetX,
  //     offsetY,
  //   }
  //   mouseCollectMode.value = null
  // }

  mousePosition.value = {
    x: Math.round((offsetX + pan.value.x) / scale.value),
    y: Math.round((offsetY + pan.value.y) / scale.value)
  }

  debugData.value.mouse = {
    offsetX,
    offsetY,
    ...mousePosition.value,
    ratio: round((Math.sqrt((offsetX ** 2) + (offsetY ** 2)) / Math.sqrt((mousePosition.value.x ** 2) + (mousePosition.value.y ** 2))), 1)
  }

  if (mode.value === 'pan' && isMouseDown.value) {
    pan.value.x += movementX * -1
    pan.value.y += movementY * -1
  }
}

function handleZoom({ deltaY }: WheelEvent) {
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

const viewTransform = computed(
  () => `translate(${pan.value.x * -1},${pan.value.y * -1}) scale(${scale.value})`
)

const nodeRadius = computed(() => 8 / (scale.value))

const scaleThreshold = ref<'sm' | 'md' | 'lg'>('lg')
const gridSnapSize = ref(0)

watch(scale, () => {
  let threshold: 'sm' | 'md' | 'lg'
  let size: number

  switch (true) {
    case scale.value >= 1 && scale.value < 1.5:
      threshold = 'md'
      size = 25
      break

    case scale.value >= 1.5:
      threshold = 'sm'
      size = 10
      break

    default:
      threshold = 'lg'
      size = 100
  }

  scaleThreshold.value = threshold
  gridSnapSize.value = snap.value ? size : 0
}, {
  immediate: true,
})

const editorState = {
  scale,
  svg,
  gridSnapSize,
  pan,
  mode,
  mousePosition,
  nodeRadius,
  basePixelsPerMeter: ppm,
}
export type EditorState = typeof editorState
provide('editor', editorState)
</script>

<template>
  <div class="grow grid grid-cols-[auto_1fr] grid-rows-[auto_1fr] gap-4">
    <div class="col-span-2 flex gap-4">
      <fieldset class="flex gap-2">
        <legend>Pan</legend>

        <label>
          X <UInput v-model="pan.x" type="number" class="max-w-22"/>
        </label>

        <label>
          Y <UInput v-model="pan.y" type="number" class="max-w-22"/>
        </label>
      </fieldset>
      <UFormField label="Scale" class="max-w-22">
        <UInput
          v-model="scale"
          type="number"
          step="0.1"
          class="max-w-22"
        />
      </UFormField>

<!--      <UBadge-->
<!--        size="xl"-->
<!--        class="self-end"-->
<!--        color="neutral"-->
<!--        variant="outline"-->
<!--      >-->
<!--        clicked: {{ isMouseDown }}-->
<!--      </UBadge>-->

<!--      <UFieldGroup>-->
<!--        <UButton-->
<!--          v-for="[label, mode] in [['TL', 'topLeft'], ['TM', 'topMid'], ['TR','topRight']] as [string, keyof typeof mouseCollection][]"-->
<!--          :label-->
<!--          :active="mouseCollectMode === mode"-->
<!--          class="self-end"-->
<!--          variant="subtle"-->
<!--          active-variant="solid"-->
<!--          size="lg"-->
<!--          square-->
<!--          @click="mouseCollectMode = mode"-->
<!--        />-->
<!--      </UFieldGroup>-->

      <UFormField label="Snap">
        <USwitch
          v-model="snap"
          size="xl"
        />
      </UFormField>
    </div>
    <div class="space-y-2">
      <UFieldGroup
        v-for="(group, index) in editorButtons"
        :key="index"
        orientation="vertical"
      >
        <UTooltip
          v-for="button in group"
          :key="button.id"
          :kbds="button.kbds"
          :text="button.label"
          :delay-duration="0"
          :content="{
            align: 'center',
            side: 'right',
            sideOffset: 0,
          }"
          :ui="{
            kbds: 'inline-flex',
          }"
          arrow
        >
          <UButton
            :icon="button.icon"
            :active="unref(button.active)"
            variant="subtle"
            active-variant="solid"
            size="lg"
            square
            @click="button.onClick"
          />
        </UTooltip>
      </UFieldGroup>
    </div>
    <svg
      id="floor-plan-editor-svg"
      ref="floorPlanEditorSvgRef"
      class="bg-white/75 touch-none place-self-stretch"
      :class="{
        '**:select-none': mode !== 'text',
        '**:cursor-default': mode === 'select',
        'cursor-grab': mode === 'pan' && !isMouseDown,
        'cursor-grabbing': mode === 'pan' && isMouseDown,
        'cursor-move': mode === 'move',
        'cursor-text': mode === 'text',
      }"
      @mousedown="mouseDown = true"
      @mouseup="mouseDown = false"
      @mousemove="handleMouseMove"
      @wheel.prevent="handleZoom"
    >
      <defs>
        <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 z" />
        </marker>

        <pattern
          id="grid-lg"
          :width="gridSize"
          :height="gridSize"
          patternUnits="userSpaceOnUse"
        >
          <!-- one cell: draw right + bottom edges -->
          <rect
            :width="gridSize"
            :height="gridSize"
            class="stroke-1 stroke-black/15 fill-none"
            vector-effect="non-scaling-stroke"
          />
        </pattern>

        <pattern
          id="grid-md"
          :width="gridSize / 4"
          :height="gridSize / 4"
          patternUnits="userSpaceOnUse"
        >
          <!-- one cell: draw right + bottom edges -->
          <rect
            :width="gridSize"
            :height="gridSize"
            class="stroke-1 stroke-black/10 fill-none"
            vector-effect="non-scaling-stroke"
          />
        </pattern>

        <pattern
          id="grid-sm"
          :width="gridSize / 10"
          :height="gridSize / 10"
          patternUnits="userSpaceOnUse"
        >
          <!-- one cell: draw right + bottom edges -->
          <rect
            :width="gridSize"
            :height="gridSize"
            class="stroke-1 stroke-black/10 fill-none"
            vector-effect="non-scaling-stroke"
          />
        </pattern>
      </defs>

      <g :transform="viewTransform">
        <rect
          :x="-gridExtent / 2"
          :y="-gridExtent / 2"
          :width="gridExtent"
          :height="gridExtent"
          fill="url(#grid-lg)"
        />

        <rect
          v-if="scale >= 1 && scale < 1.5"
          :x="-gridExtent / 2"
          :y="-gridExtent / 2"
          :width="gridExtent"
          :height="gridExtent"
          fill="url(#grid-md)"
        />

        <rect
          v-if="scale >= 1.5"
          :x="-gridExtent / 2"
          :y="-gridExtent / 2"
          :width="gridExtent"
          :height="gridExtent"
          fill="url(#grid-sm)"
        />

        <!-- Rooms -->
        <RoomPlan
          v-for="(room, index) in rooms"
          :key="room.id"
          v-model="rooms[index]!"
          :pixel-per-meter="ppm"
          :snap
          :editor-mode="mode"
        />
      </g>
    </svg>
  </div>
</template>