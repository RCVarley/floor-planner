<script setup lang="ts">
import type {Floor} from "@floor-plan/types/floor.ts"

const { floor } = defineProps<{
  floor: Floor
}>()

const pointsString = floor.points.map(p => `${p.x},${p.y}`).join(' ')
</script>

<template>
  <g class="floor">
    <polygon :points="pointsString"/>
  </g>
</template>

<style scoped>

</style>