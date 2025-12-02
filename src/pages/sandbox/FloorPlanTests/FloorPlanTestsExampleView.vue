<script setup lang="ts">
import {reactive} from "vue"
import {createPlan} from "@/utils/floorPlan.ts"
import FloorPlanEditorV2 from '@editor/components/FloorPlanEditor.vue'

const { data, error } = createPlan()
if (error) {
  throw error
}

const plan = reactive(data)
</script>

<template>
<FloorPlanEditorV2
  v-model="plan"
/>
</template>

<style scoped>

</style>