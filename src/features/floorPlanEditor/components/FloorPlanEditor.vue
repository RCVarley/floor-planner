<script setup lang="ts">
// import {computed, type ModelRef, ref} from "vue"
// import type {EditorToolName, Point} from "@editor/types/svgEditor.ts"
// import AppConfig from "@/app.config.ts"
// import {getPointerPosition} from "@editor/utilities/points.ts"
// import {useSelectTool} from "@editor/composables/useSelectTool.ts"
// import type {ToolbarButtonGroup} from "@editor/types/toolbarButton.ts"
// import {brandedId} from "@/features/general/utilities/ids.ts"
//
// const panX = defineModel<number>('panX', { default: 0 })
// const panY = defineModel<number>('panY', { default: 0 })
// const scale = defineModel<number>('zoom', { default: 1 })
// const snap = defineModel<boolean>('snap', { default: false })
//
// const icons = AppConfig.ui.icons
//
// const activeToolName = ref<EditorToolName>('select')
//
// // const nodeRadius = computed(() => 8 / (scale.value))
// const pointerPosition = ref<Point | null>(null)
// const pointerDown = ref(false)
// const forcePointerDown = ref(false)
// const isPointerDown = computed(() => pointerDown.value || forcePointerDown.value)
// function onPointerMove(e: PointerEvent) {
//   pointerPosition.value = getPointerPosition(e, { x: panX.value, y: panY.value }, scale)
//
//   if (activeToolName.value === 'pan' && pointerDown.value) {
//     panX.value += e.movementX * -1
//     panY.value += e.movementY * -1
//   }
// }
//
// function onPointerLeave(_e: PointerEvent) {
//   pointerPosition.value = null
// }
//
//
// // const {toolbarGroups} = useEditorToolbar({
// //   activeTool: activeToolName,
// // })
//
// const showPropertiesPanel = ref(false)
// const isShowingPropertiesPanel = computed(() => showPropertiesPanel.value)
//
// const selectTool = useSelectTool({
//   activeToolName,
//   panX,
//   panY,
//   scale,
// })
//
// const toolbarGroups = computed<ToolbarButtonGroup[]>(() => ([
//   {
//     id: brandedId('general'),
//     name: 'General',
//     buttons: [
//       selectTool.toolbarButton
//     ],
//   }
// ]))
</script>

<template>
<div class="floor-plan-editor grow grid grid-cols-[auto_1fr_auto] grid-rows-[auto_1fr] gap-4">
<!--  <div-->
<!--    class="col-start-1 flex gap-4"-->
<!--    :class="isShowingPropertiesPanel ? 'col-span-2' : 'col-span-3'"-->
<!--  >-->
<!--    <fieldset class="flex gap-2">-->
<!--      <legend>Pan</legend>-->

<!--      <label>-->
<!--        X <UInput v-model="panOffset.x" type="number" class="max-w-22"/>-->
<!--      </label>-->

<!--      <label>-->
<!--        Y <UInput v-model="panOffset.y" type="number" class="max-w-22"/>-->
<!--      </label>-->
<!--    </fieldset>-->
<!--    <UFormField label="Scale" class="max-w-22">-->
<!--      <UInput-->
<!--        v-model="scale"-->
<!--        type="number"-->
<!--        step="0.1"-->
<!--        class="max-w-22"-->
<!--      />-->
<!--    </UFormField>-->

<!--&lt;!&ndash;    <UFormField label="Snap">&ndash;&gt;-->
<!--&lt;!&ndash;      <USwitch&ndash;&gt;-->
<!--&lt;!&ndash;        v-model="snap"&ndash;&gt;-->
<!--&lt;!&ndash;        size="xl"&ndash;&gt;-->
<!--&lt;!&ndash;      />&ndash;&gt;-->
<!--&lt;!&ndash;    </UFormField>&ndash;&gt;-->
<!--    <UButton-->
<!--      v-if="!isShowingPropertiesPanel"-->
<!--      :active="true"-->
<!--      variant="subtle"-->
<!--      active-variant="solid"-->
<!--      :icon="isShowingPropertiesPanel ? icons.panelClose : icons.panelOpen"-->
<!--      aria-label="Properties"-->
<!--      class="ml-auto self-end"-->
<!--      :ui="{-->
<!--          leadingIcon: 'rotate-180'-->
<!--        }"-->
<!--      square-->
<!--      @click="showPropertiesPanel = !showPropertiesPanel"-->
<!--    />-->
<!--  </div>-->
<!--  <EditorToolbar-->
<!--    :groups="toolbarGroups"-->
<!--    :active-tool-name-->
<!--    class="col-start-1"-->
<!--  />-->
<!--  <SvgEditorCore-->
<!--    :panOffset-->
<!--    :snap-->
<!--    :zoom="scale"-->
<!--    :pointer-down="isPointerDown"-->
<!--    @pointerdown="pointerDown = true"-->
<!--    @pointerup="pointerDown = false"-->
<!--    @pointerleave="onPointerLeave"-->
<!--    @pointermove="onPointerMove"-->
<!--  >-->
<!--    <template #banding>-->
<!--      <rect-->
<!--        v-if="selectTool.preview.value.visible"-->
<!--        :x="selectTool.preview.value.x"-->
<!--        :y="selectTool.preview.value.y"-->
<!--        :width="selectTool.preview.value.width"-->
<!--        :height="selectTool.preview.value.height"-->
<!--        class="fill-black/10 stroke-black-2"-->
<!--      />-->

<!--&lt;!&ndash;      <line&ndash;&gt;-->
<!--&lt;!&ndash;        v-if="cursorLine"&ndash;&gt;-->
<!--&lt;!&ndash;        :x1="cursorLine.x1"&ndash;&gt;-->
<!--&lt;!&ndash;        :y1="cursorLine.y1"&ndash;&gt;-->

<!--&lt;!&ndash;        :x2="cursorLine.x2"&ndash;&gt;-->
<!--&lt;!&ndash;        :y2="cursorLine.y2"&ndash;&gt;-->
<!--&lt;!&ndash;      />&ndash;&gt;-->
<!--    </template>-->
<!--  </SvgEditorCore>-->
<!--  <UCard-->
<!--    v-if="isShowingPropertiesPanel"-->
<!--    class="col-start-3 row-start-1 row-span-2 mt-0.5"-->
<!--    :ui="{-->
<!--        header: 'flex gap-4 items-center',-->
<!--      }"-->
<!--  >-->
<!--    <template #header>-->
<!--      <UButton-->
<!--        :active="!isShowingPropertiesPanel"-->
<!--        variant="subtle"-->
<!--        active-variant="solid"-->
<!--        :icon="icons.panelClose"-->
<!--        aria-label="Properties"-->
<!--        class="ml-auto self-end"-->
<!--        :ui="{-->
<!--            leadingIcon: 'rotate-180'-->
<!--          }"-->
<!--        square-->
<!--        @click="showPropertiesPanel = !showPropertiesPanel"-->
<!--      />-->
<!--      <h2>Properties</h2>-->
<!--    </template>-->
<!--    <template #default>-->
<!--&lt;!&ndash;      <pre>{{ selectedEntity }}</pre>&ndash;&gt;-->
<!--    </template>-->
<!--  </UCard>-->
</div>
</template>