<script setup lang="ts">
import {reactive, ref} from "vue"
import {createRoom, createSection} from "@/utils/floorPlan.ts"
import { ui } from '@/app.config.ts'
import type {Room} from "@/types/floorPlanEntities/room.ts";

const icons = ui.icons

function createDiagram() {
  return createRoom({
    sections: [
      createSection({
        polygon: [
          {x: 0, y: 0},
          {x: 0, y: 100},
          {x: 100, y: 100},
          {x: 100, y: 0},
        ],
      })
    ],
    offset: { x: 0, y: 0 },
  })
}

const rooms = reactive<Room[]>([createDiagram()])
function resetRooms() {
  const len = rooms.length
  for (let i = 0; i < len; i++) {
    rooms.pop()
  }

  rooms.push(createDiagram())
  pan.value.x = 0
  pan.value.y = 0
  snap.value = false
  zooms.value = [1, 0.5, 2]
}

const pan = ref({ x: 0, y: 0 })
const snap = ref(true)
const zooms = ref([1, 0.5, 2])
</script>

<template>
  <div class="space-y-8">
    <Teleport to="#dashboard-panel__navbar-right" defer>
      <UButton
        :icon="icons.refresh"
        color="neutral"
        @click="resetRooms"
      />
    </Teleport>

    <FloorPlanEditor
      v-model="rooms"
      v-model:pan="pan"
      v-model:snap="snap"
      v-model:zoom="zooms[0]"
    />

    <FloorPlanEditor
      v-model="rooms"
      v-model:pan="pan"
      v-model:snap="snap"
      v-model:zoom="zooms[1]"
    />

    <FloorPlanEditor
      v-model="rooms"
      v-model:pan="pan"
      v-model:snap="snap"
      v-model:zoom="zooms[2]"
    />
  </div>
</template>

<style scoped>

</style>