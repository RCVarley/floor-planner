<script setup lang="ts">
import {reactive, ref} from "vue"
import {createPlan} from "@floor-plan/utilities/floorPlan.ts"
import { ui } from '@/app.config.ts'
import type {FloorPlan} from "@floor-plan/types/floorPlan.ts"
import {resetReactiveArray} from "@/features/general/utilities/reactivityHelpers.ts"
import {handleError} from "@/features/error/utilities/errorHandling.ts"

const icons = ui.icons

function createDiagram() {
  const { data, error } = createPlan({
    name: 'TestPlan',
    buildings: [],
    floors: [],
    rooms: [],
    sections: [],
    fixtures: [],
    labels: [],
  })

  if (error) {
    handleError(error)
  }

  return data
}

const plan = reactive<FloorPlan>(createDiagram())
function reset() {
  resetReactiveArray(plan.buildings)
  resetReactiveArray(plan.floors)
  resetReactiveArray(plan.rooms)
  resetReactiveArray(plan.sections)
  resetReactiveArray(plan.fixtures)
  resetReactiveArray(plan.labels)

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
        @click="reset"
      />
    </Teleport>

    <FloorPlanEditor
      v-model="plan"
      v-model:pan="pan"
      v-model:snap="snap"
      v-model:zoom="zooms[0]"
    />

    <FloorPlanEditor
      v-model="plan"
      v-model:pan="pan"
      v-model:snap="snap"
      v-model:zoom="zooms[1]"
    />

    <FloorPlanEditor
      v-model="plan"
      v-model:pan="pan"
      v-model:snap="snap"
      v-model:zoom="zooms[2]"
    />
  </div>
</template>

<style scoped>

</style>