import type {ToolbarButtonGroup} from "@editor/types/toolbarButton.ts"
import {brandedId} from "@/features/general/utilities/ids.ts"
import {computed, type Ref, unref} from "vue"
import type {EditorToolName} from "@editor/types/svgEditor.ts"
import appConfig from "@/app.config.ts"

const icons = appConfig.ui.icons

export const useEditorToolbar = (
  {
    activeTool,
  }: {
    activeTool: Ref<EditorToolName>
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
          toolName: 'pan',
          label: 'Pan',
          icon: icons.hand,
          kbds: ['p'],
          onClick: () => activeTool.value = 'pan',
        },
        {
          id: brandedId('move'),
          toolName: 'move',
          label: 'Move',
          icon: icons.move,
          kbds: ['m'],
          onClick: () => activeTool.value = 'move',
        },
        {
          id: brandedId('Select'),
          toolName: 'Select',
          label: 'Select',
          kbds: ['s'],
          icon: icons.selectTool,
          onClick: () => activeTool.value = 'select',
        },
        {
          id: brandedId('Text'),
          toolName: 'Text',
          label: 'Text',
          kbds: ['t'],
          icon: icons.text,
          onClick: () => activeTool.value = 'text',
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