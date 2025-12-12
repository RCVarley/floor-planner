import type {ButtonProps} from "@nuxt/ui/components/Button.vue"
import type {KbdProps} from "@nuxt/ui/components/Kbd.vue"
import type {ComputedRef} from "vue"

export type ToolbarButtonId = string & { __brand: 'ToolbarButtonId' }

export interface ToolbarButtonProps extends Omit<ButtonProps, 'onClick' | 'active'> {
  id: ToolbarButtonId
  toolName: string
  onClick?: (() => void) | (() => Promise<void>)
  kbds?: KbdProps['value'][]
  hidden?: boolean | ComputedRef<boolean>
  children?: ToolbarButtonProps[]
  items?: ToolbarButtonProps[]
}

export type ToolbarButtonGroupId = string & { __brand: 'ToolbarButtonGroupId' }

export interface ToolbarButtonGroup {
  id: ToolbarButtonGroupId
  name: string
  buttons: ToolbarButtonProps[]
  hidden?: boolean | ComputedRef<boolean>
}