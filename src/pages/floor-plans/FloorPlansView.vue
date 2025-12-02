<script setup lang="ts">
import appConfig from "@/app.config.ts"
import DashboardPanel from "@/layouts/DashboardPanel.vue";
import {reactive} from "vue";

import type {Room} from "@/types/floorPlanEntities/room.ts";

const icons = appConfig.ui.icons

const rooms = reactive<Room[]>([])
</script>

<template>
  <DashboardPanel
    title="Floor Plans"
    :icon="icons.client"
  >
    <template #navbarRight>
      <UModal
        title="Add a floor plan"
        description="Create a new floor plan."
        :fullscreen="true"
        :ui="{
          body: '@container',
        }"
      >
        <UButton
          label="Add floor plan"
          color="neutral"
          :icon="icons.plus"
        />

        <template #body>
          <FloorPlanEditor v-model="rooms"/>
        </template>
      </UModal>
    </template>

  </DashboardPanel>
</template>

<style scoped>

</style>