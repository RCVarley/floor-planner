<script setup lang="ts">
import type {IconName} from "@/features/icons/utilities/icons.ts"

defineProps<{
  title: string
  icon: IconName
  ui?: Partial<{
    navbarRight: string,
    body: string,
  }>
}>()

defineSlots<{
  navbarRight(): any,
  default(): any
}>()
</script>

<template>
  <UDashboardPanel
    :ui="{
      body: `@container ${ui?.body ?? ''}`,
    }"
  >
    <template #header>
      <UDashboardNavbar
        :title
        :icon
        :ui="{
          right: ui?.navbarRight,
        }"
      >
        <template #right>
          <div
            id="dashboard-panel__navbar-right"
            class="contents"
          >
            <slot name="navbarRight"/>
          </div>
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <slot/>
    </template>
  </UDashboardPanel>
</template>

<style scoped>

</style>