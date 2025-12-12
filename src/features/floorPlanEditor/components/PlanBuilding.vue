<script setup lang="ts">
import type {Building} from "@floor-plan/types/building.ts"

const { building } = defineProps<{
  building: Building
}>()

const pointsString = building.points.map(p => `${p.x},${p.y}`).join(' ')
</script>

<template>
<g class="building">
  <polygon :points="pointsString"/>
</g>
</template>

<style scoped>

</style>