import {inject} from "vue"
import type {EditorState} from "@/components/floorPlanEditor/FloorPlanEditor.vue"

export const useEditorState = () => {
  const editor = inject<EditorState>('editor')
  if (!editor) {
    throw new Error('could not find editor state')
  }

  return editor
}