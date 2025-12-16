<script setup lang="ts">
import {computed} from "vue"
import type {SvgEditorCoreProps} from "@editor/types/svgEditor.ts"
import {useEditorGrid} from "@editor/composables/useEditorGrid.ts"

const {
  panX,
  panY,
} = defineProps<SvgEditorCoreProps>()

defineSlots<{
  banding(): any
  default(): any
  defs(): any
}>()

const scale = defineModel<number>('zoom', { default: 1 })
const snap = defineModel<boolean>('snap', { default: false })

const viewTransform = computed(
  () => `translate(${panX * -1},${panY * -1}) scale(${scale.value})`
)

const { gridSize, gridExtent, scaleThreshold } = useEditorGrid({ snap, scale })

</script>

<template>
  <svg
    id="svg-editor"
    ref="svgEditor"
    class="bg-white/75 touch-none place-self-stretch border-1 col-start-2 row-start-2"
    :class="[
        {
          '**:select-none': activeToolName !== 'text',
          '**:cursor-move': activeToolName === 'move',
          '**:cursor-text': activeToolName === 'text',
        }
      ]"
  >
    <defs>
      <slot name="defs"/>

      <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
        <path d="M0,0 L6,3 L0,6 z" />
      </marker>

      <pattern
        id="grid-lg"
        :width="gridSize"
        :height="gridSize"
        patternUnits="userSpaceOnUse"
      >
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
        v-if="scaleThreshold === 'md'"
        :x="-gridExtent / 2"
        :y="-gridExtent / 2"
        :width="gridExtent"
        :height="gridExtent"
        fill="url(#grid-md)"
      />

      <rect
        v-if="scaleThreshold === 'sm'"
        :x="-gridExtent / 2"
        :y="-gridExtent / 2"
        :width="gridExtent"
        :height="gridExtent"
        fill="url(#grid-sm)"
      />

      <slot name="default"/>

      <!-- Banding -->
      <slot name="banding"/>
    </g>
  </svg>
</template>

<style>
</style>