import type {ToolbarButtonGroup} from "@/types/toolbarButton.ts";
import {brandedId} from "@/utils/ids.ts";
import {computed, type Ref, unref} from "vue";
import type {ToolName} from "@/types/svgEditor.ts";
import appConfig from "@/app.config.ts";

const icons = appConfig.ui.icons

export const useEditorToolbar = (
  {
    mode,
  }: {
    mode: Ref<ToolName>
  },
  ...toolbarGroups: ToolbarButtonGroup[][]
) => {
  const _toolbarGroups: ToolbarButtonGroup[] = [
    {
      id: brandedId('general'),
      name: 'General',
      buttons: [
        {
          id: brandedId('pan'),
          label: 'Pan',
          icon: icons.hand,
          kbds: ['p'],
          active: computed(() => mode.value === 'pan'),
          onClick: () => mode.value = 'pan',
        },
        {
          id: brandedId('move'),
          label: 'Move',
          icon: icons.move,
          kbds: ['m'],
          active: computed(() => mode.value === 'move'),
          onClick: () => mode.value = 'move',
        },
        {
          id: brandedId('Select'),
          label: 'Select',
          kbds: ['s'],
          icon: icons.cursor,
          active: computed(() => mode.value === 'select'),
          onClick: () => mode.value = 'select',
        },
        {
          id: brandedId('Text'),
          label: 'Text',
          kbds: ['t'],
          icon: icons.text,
          active: computed(() => mode.value === 'text'),
          onClick: () => mode.value = 'text',
        },
      ]
    },
    ...toolbarGroups.flat(),
  ]

  const filteredToolbarGroups = computed(() => _toolbarGroups
    .filter(group => !group.hidden)
    .map(({buttons, ...rest}) => ({
      buttons: buttons.filter((button) => !unref(button.hidden)),
      ...rest,
    }))
    .filter(group => !!group.buttons.length)
  )

  return {
    toolbarGroups: filteredToolbarGroups,
  }
}