<script setup lang="ts">
import appConfig from "@/app.config.ts"
import DashboardPanel from "@/layouts/DashboardPanel.vue"

const icons = appConfig.ui.icons
</script>

<template>
  <DashboardPanel
    title="Editor"
    :icon="icons.svg"
  >
    <RouterView/>
  </DashboardPanel>
</template>

<style scoped>

</style>