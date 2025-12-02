import type {ButtonProps} from "@nuxt/ui/components/Button.vue";
import type {KbdProps} from "@nuxt/ui/components/Kbd.vue";
import type {ComputedRef} from "vue";

export type ToolbarButtonId = string & { __brand: 'ToolbarButtonId' }

export interface ToolbarButtonProps extends Omit<ButtonProps, 'onClick' | 'active'> {
  id: ToolbarButtonId
  onClick?: (() => void) | (() => Promise<void>)
  kbds?: KbdProps['value'][]
  active?: boolean | ComputedRef<boolean>
  items?: ToolbarButtonProps[]
  children?: ToolbarButtonProps[]
  hidden?: boolean | ComputedRef<boolean>
}

export type ToolbarButtonGroupId = string & { __brand: 'ToolbarButtonGroupId' }

export interface ToolbarButtonGroup {
  id: ToolbarButtonGroupId
  name: string
  buttons: ToolbarButtonProps[]
  hidden?: boolean | ComputedRef<boolean>
}