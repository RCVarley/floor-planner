<script setup lang="ts">
import appConfig from "@/app.config.ts"
import DashboardPanel from "@/layouts/DashboardPanel.vue";
import DebugSquare from "@/components/debug/DebugSquare.vue";

const icons = appConfig.ui.icons

const examples = [
  ['auto', 'cursor-auto'],
  ['default', 'cursor-default'],
  ['pointer', 'cursor-pointer'],
  ['wait', 'cursor-wait'],
  ['text', 'cursor-text'],
  ['move', 'cursor-move'],
  ['help', 'cursor-help'],
  ['not-allowed', 'cursor-not-allowed'],
  ['none', 'cursor-none'],
  ['context-menu', 'cursor-context-menu'],
  ['progress', 'cursor-progress'],
  ['cell', 'cursor-cell'],
  ['crosshair', 'cursor-crosshair'],
  ['vertical-text', 'cursor-vertical-text'],
  ['alias', 'cursor-alias'],
  ['copy', 'cursor-copy'],
  ['no-drop', 'cursor-no-drop'],
  ['grab', 'cursor-grab'],
  ['grabbing', 'cursor-grabbing'],
  ['all-scroll', 'cursor-all-scroll'],
  ['col-resize', 'cursor-col-resize'],
  ['row-resize', 'cursor-row-resize'],
  ['n-resize', 'cursor-n-resize'],
  ['e-resize', 'cursor-e-resize'],
  ['s-resize', 'cursor-s-resize'],
  ['w-resize', 'cursor-w-resize'],
  ['ne-resize', 'cursor-ne-resize'],
  ['nw-resize', 'cursor-nw-resize'],
  ['se-resize', 'cursor-se-resize'],
  ['sw-resize', 'cursor-sw-resize'],
  ['ew-resize', 'cursor-ew-resize'],
  ['ns-resize', 'cursor-ns-resize'],
  ['nesw-resize', 'cursor-nesw-resize'],
  ['nwse-resize', 'cursor-nwse-resize'],
  ['zoom-in', 'cursor-zoom-in'],
  ['zoom-out', 'cursor-zoom-out'],
]
</script>

<template>
  <DashboardPanel
    title="Dashboard"
    :icon="icons.dashboard"
    :ui="{ body: 'grid grid-cols-4' }"
  >
    <DebugSquare
      v-for="[key, val] in examples"
      :key="key"
      :class="val"
    >
      {{ val }}
    </DebugSquare>
  </DashboardPanel>
</template>

<style scoped>

</style>