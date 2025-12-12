<script setup lang="ts">
import type {Room} from "@floor-plan/types/room.ts"

const { room } = defineProps<{
  room: Room
}>()

const pointsString = room.points.map(p => `${p.x},${p.y}`).join(' ')
</script>

<template>
  <g class="room">
    <polygon :points="pointsString"/>
  </g>
</template>

<style scoped>

</style>