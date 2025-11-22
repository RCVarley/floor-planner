<script setup lang="ts">
import appConfig from "@/app.config.ts"
import DashboardPanel from "@/layouts/DashboardPanel.vue";

const icons = appConfig.ui.icons
</script>

<template>
  <DashboardPanel
    title="Floor Plan"
    :icon="icons.floorPlan"
  >
    <FloorPlanEditor/>
  </DashboardPanel>
</template>

<style scoped>

</style>