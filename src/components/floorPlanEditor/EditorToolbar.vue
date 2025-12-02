<script setup lang="ts">
import {unref} from "vue"
import type {ToolbarButtonGroup} from "@/types/toolbarButton.ts";

defineProps<{
  groups: ToolbarButtonGroup[]
}>()

</script>

<template>
  <div class="space-y-2">
    <UFieldGroup
      v-for="group in groups"
      :key="group.id"
      orientation="vertical"
    >
      <UTooltip
        v-for="button in group.buttons"
        :key="button.id"
        :kbds="button.kbds"
        :text="button.label"
        :delay-duration="0"
        :content="{
            align: 'center',
            side: 'right',
            sideOffset: 0,
          }"
        :ui="{
            kbds: 'inline-flex',
          }"
        arrow
      >
        <UButton
          :icon="button.icon"
          :active="unref(button.active)"
          variant="subtle"
          active-variant="solid"
          size="lg"
          square
          @click="button.onClick"
        />
      </UTooltip>
    </UFieldGroup>
  </div>
</template>

<style scoped>

</style>