import type { AppProps } from '@nuxt/ui'
import {type IconRegister, iconDefinitions, registerIcon} from "./features/icons/utilities/icons.ts"

export const app: AppProps = {
  tooltip: {
    delayDuration: 250,
  }
} as const

/**
 * # registerIcons
 * @description Registers icons with the Iconify library.
 */
export async function registerIcons() {
  const promises: Promise<void>[] = []
  const keys: Array<keyof typeof ui.icons> = Object.keys(ui.icons) as Array<keyof typeof ui.icons>
  for (const key of keys) {
    const icon = ui.icons[key]!
    promises.push(registerIcon(icon))
  }

  await Promise.all(promises)
}

/**
 * The `ui` constant is an object that encapsulates user-interface-related configurations
 * for the application. It contains a property `icons` which provides a definition of
 * the icons used in the UI, ensuring type safety and consistency throughout the application.
 *
 * @property icons - The collection of icon definitions used in the UI,
 * ensuring alignment with the defined `IconDefinition` type.
 */
export const ui = {
  icons: iconDefinitions
} as const satisfies { icons: IconRegister }

export default {
  app,
  ui,
} as const