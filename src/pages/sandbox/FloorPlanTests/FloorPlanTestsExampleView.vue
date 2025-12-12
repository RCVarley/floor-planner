<script setup lang="ts">
import {reactive} from "vue"
import {createPlan} from "@floor-plan/utilities/floorPlan.ts"

const { data, error } = createPlan()
if (error) {
  throw error
}

const plan = reactive(data)
</script>

<template>
<SvgEditor
  v-model="plan"
/>
</template>

<style scoped>

</style>