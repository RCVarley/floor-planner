<script setup lang="ts">
import type {EditorRibbonProps} from "@editor/types/svgEditor.ts";
import AppConfig from "@/app.config.ts";

defineProps<EditorRibbonProps>()

defineEmits<{
  togglePropertiesPanel: never
}>()

const panX = defineModel<number>('panX', { required: true })
const panY = defineModel<number>('panY', { required: true })
const scale = defineModel<number>('scale', { required: true })

const icons = AppConfig.ui.icons

</script>

<template>
  <div
    class="col-start-1 flex gap-4"
    :class="isShowingPropertiesPanel ? 'col-span-2' : 'col-span-3'"
  >
    <fieldset class="flex gap-2">
      <legend>Pan</legend>

      <label>
        X
        <UInput
          v-model="panX"
          type="number"
          class="max-w-22"
        />
      </label>

      <label>
        Y
        <UInput
          v-model="panY"
          type="number"
          class="max-w-22"
        />
      </label>
    </fieldset>
    <UFormField label="Scale" class="max-w-22">
      <UInput
        v-model="scale"
        type="number"
        step="0.1"
        class="max-w-22"
      />
    </UFormField>

    <UFormField label="Active Tool" class="max-w-22">
      <UInput
        :model-value="activeToolName"
        type="text"
        class="max-w-22"
        variant="subtle"
        readonly
      />
    </UFormField>

    <!--    <UFormField label="Snap">-->
    <!--      <USwitch-->
    <!--        v-model="snap"-->
    <!--        size="xl"-->
    <!--      />-->
    <!--    </UFormField>-->
    <UButton
      v-if="!isShowingPropertiesPanel"
      :active="true"
      variant="subtle"
      active-variant="solid"
      :icon="isShowingPropertiesPanel ? icons.panelClose : icons.panelOpen"
      aria-label="Properties"
      class="ml-auto self-end"
      :ui="{
          leadingIcon: 'rotate-180'
        }"
      square
      @click="$emit('togglePropertiesPanel')"
    />
  </div>
</template>

<style scoped>

</style>