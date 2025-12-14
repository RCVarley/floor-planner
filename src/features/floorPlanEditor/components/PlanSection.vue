<script setup lang="ts">
import type {Section} from "@floor-plan/types/section.ts"

const { section } = defineProps<{
  section: Section
}>()

const pointsString = section.points.map(p => `${p.x},${p.y}`).join(' ')
</script>

<template>
  <polygon
    :points="pointsString"
    class="section"
  />
</template>

<style scoped>

</style>