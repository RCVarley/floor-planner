<script setup lang="ts">
import type {Point} from "@editor/types/svgEditor.ts"
import {ref} from "vue"
import {watchDebounced} from '@vueuse/core'

const {
  points,
} = defineProps<{
  id: string,
  points: Point[]
}>()

const pointString = ref('')

const minX = ref<number | null>(null)
const maxX = ref<number | null>(null)
const minY = ref<number | null>(null)
const maxY = ref<number | null>(null)

watchDebounced(
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
    debounce: 100,
    maxWait: 300,
  }
)

</script>

<template>
  <polygon
    :id
    :points="pointString"
  />
</template>

<style scoped>

</style>