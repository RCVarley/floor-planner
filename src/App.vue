<script setup lang="ts">
import type {NavigationMenuItem} from "@nuxt/ui/components/NavigationMenu.vue"
import appConfig from "@/app.config.ts"
import {useDevStore} from "@/stores/devStore.ts"
import {storeToRefs} from "pinia"
import {computed, ref} from "vue"
import {useDebug} from "@/composables/useDebug.ts"
import {type CustomRouteRecordRaw, routes} from './router.ts'

const { isDebug } = storeToRefs(useDevStore())
const { debugData } = useDebug()
const debugPanel = ref(false)

const icons = appConfig.ui.icons

function routeToNavItem(route: CustomRouteRecordRaw): NavigationMenuItem {
  return {
    label: route.meta.label,
    icon: route.meta.icon,
    to: route,
    children: route.children?.map(r => routeToNavItem(r)),
  }
}

const menuItems: NavigationMenuItem[][] = [
  routes
    .filter(r => r.meta.showInNav)
    .map(r => routeToNavItem(r)),
]

const endItems = computed<NavigationMenuItem[][]>(() => [
  [
    {
      type: 'label',
      label: 'Dev',
    },
    {
      label: 'Debug',
      slot: 'debug' as const,
      onSelect() {
        isDebug.value = !isDebug.value
      },
      icon: isDebug.value ? icons.bug : icons.bugOff,
      ui: {
        linkLeadingIcon: isDebug.value ? 'text-warning' : '',
      },
    },
    // {
    //   label: 'Debug panel',
    //   slot: 'panel' as const,
    //   onSelect() {
    //     debugPanel.value = !debugPanel.value
    //   },
    //   icon: isDebug.value ? icons.bug : icons.bugOff,
    //   ui: {
    //     linkLeadingIcon: debugPanel.value ? 'text-warning' : '',
    //   },
    // }
  ],
])
</script>

<template>
  <UApp v-bind="appConfig.app">
    <UDashboardGroup>
      <UDashboardSidebar
        :min-size="15"
        :default-size="20"
        :ui="{
          footer: 'border-t border-default justify-end',
          header: 'p-6'
        }"
        collapsible
        collapsed
        resizable
      >
        <template #header="{ collapsed }">
          <UIcon
            :name="icons.logo"
            class="shrink-0 size-4.5"
            alt="Floor planner logo"
          />
          <span
            v-if="!collapsed"
            class="title"
          >
            Floor Planner
          </span>
        </template>

        <template #default="{ collapsed }">
          <UNavigationMenu
            :items="menuItems"
            :collapsed
            orientation="vertical"
            :tooltip="!!collapsed"
            class="grow"
          >
            <template #list-trailing>
              <UNavigationMenu
                :items="endItems"
                :collapsed
                orientation="vertical"
                :tooltip="!!collapsed"
                class="mt-auto"
              >
                <template #debug-trailing>
                  <USwitch
                    v-model="isDebug"
                    size="md"
                    aria-label="Debug"
                    @click.stop
                  />
                </template>

                <template #panel-trailing>
                  <USwitch
                    v-model="debugPanel"
                    size="md"
                    aria-label="Show debug panel"
                    @click.stop
                  />
                </template>
              </UNavigationMenu>
            </template>
          </UNavigationMenu>
<!--          <pre-->
<!--            v-if="isDebug"-->
<!--            id="debug-data"-->
<!--          >{{debugData}}</pre>-->
        </template>

        <template #footer>
          <UDashboardSidebarCollapse/>
        </template>
      </UDashboardSidebar>

      <UDrawer
        title="Debug panel"
        description="Teleport debug data here"
        direction="right"
        class="h-full m-4"
        :overlay="false"
        :modal="false"
        :open="isDebug"
      >
        <template #body>
          <div id="debug-panel">
            <pre>{{ debugData }}</pre>
          </div>
        </template>
      </UDrawer>

      <RouterView/>

    </UDashboardGroup>
  </UApp>
</template>

<style>
/*.unm-separator:last-of-type {*/
/*  @apply mt-auto;*/
/*}*/
</style>