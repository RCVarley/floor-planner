<script setup lang="ts">
import type {Point} from "@editor/types/svgEditor.ts"
import {computed, ref, watch} from "vue"
import {useSvgElement} from '@editor/composables/useSvgElement.ts'

const {
  id,
  points,
  moveX: _moveX,
  moveY: _moveY,
} = defineProps<{
  id: string,
  points: Point[]
  moveX?: number
  moveY?: number
}>()

const pointString = ref('')

const minX = ref<number | null>(null)
const maxX = ref<number | null>(null)
const minY = ref<number | null>(null)
const maxY = ref<number | null>(null)

watch(
  () => points, (_points) => {
    pointString.value = ''
    maxX.value = null
    minX.value = null
    maxY.value = null
    minY.value = null

    if (!_points.length) {
      return
    }

    const xs: number[] = []
    const ys: number[] = []
    for (const { x, y } of _points) {
      pointString.value += ` ${x},${y}`
      xs.push(x)
      ys.push(y)
    }

    maxX.value = Math.max(...xs)
    minX.value = Math.min(...xs)
    maxY.value = Math.max(...ys)
    minY.value = Math.min(...ys)
  },
  {
    immediate: true,
    deep: true,

  }
)

const moveX = computed(() => _moveX)
const moveY = computed(() => _moveY)

const { move } = useSvgElement({ moveX, moveY })
// const { debugData } = useDebug()
// watchEffect(() => {
//   if (!debugData.value.polygon) {
//     debugData.value.polygon = {} as Record<string, any>
//   }
//   debugData.value.polygon[id] = (moveX.value || moveY.value) ? move.value : null
// })
</script>

<template>
  <polygon
    :id
    :points="pointString"
    :style="move"
  />
</template>

<style scoped>

</style>