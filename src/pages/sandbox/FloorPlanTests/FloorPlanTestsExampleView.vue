<script setup lang="ts">
import {reactive} from "vue"
import type {Room} from "@/types/floorPlan.ts"
import {createRoom, createSection} from "@/utils/floorPlan.ts"

const rooms = reactive<Room[]>([
  createRoom({
    sections: [
      createSection({
        polygon: [
          {x: 0, y: 0},
          {x: 0, y: 325},
          {x: 335, y: 345},
          {x: 355, y: 0},
        ],
      })
    ],
    offset: { x: 100, y: 100 },
  })
])
</script>

<template>
<FloorPlanEditor
  v-model="rooms"
/>
</template>

<style scoped>

</style>