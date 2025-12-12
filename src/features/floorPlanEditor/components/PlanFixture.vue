<script setup lang="ts">
import type {Fixture} from "@floor-plan/types/fixture.ts"

const { fixture } = defineProps<{
  fixture: Fixture
}>()

const pointsString = fixture.points.map(p => `${p.x},${p.y}`).join(' ')
</script>

<template>
  <g class="fixture">
    <polygon :points="pointsString"/>
  </g>
</template>

<style scoped>

</style>