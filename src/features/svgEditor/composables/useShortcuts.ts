// src/composables/useExtendedShortcuts.ts
import { useEventListener } from '@vueuse/core'
import type {ToolbarButtonGroup, ToolbarButtonProps} from "@editor/types/toolbarButton.ts"
import {type MaybeRef, unref} from "vue"
// You may need to adjust this path depending on your setup/version:

export type ExtendedShortcutHandler = (e: KeyboardEvent) => void

export type ExtendedShortcutConfig = {
  keydown?: ExtendedShortcutHandler
  keyup?: ExtendedShortcutHandler
  usingInput?: boolean | string
} | ExtendedShortcutHandler

export type ExtendedShortcutsConfig = Record<string, ExtendedShortcutConfig>

type DefineShortcutsOptions = {
  chainDelay?: number
}

export function extractShortcuts(items: MaybeRef<ToolbarButtonGroup[]>) {
  const shortcuts: any = {}
  function traverse(items2: ToolbarButtonProps[]) {
    items2.forEach((item) => {
      if (item.kbds?.length && item.onClick) {
        const shortcutKey = item.kbds.join("_")
        shortcuts[shortcutKey] = item.onClick
      }
      if (item.children) {
        traverse(item.children.flat())
      }
      if (item.items) {
        traverse(item.items.flat())
      }
    });
  }
  traverse(unref(items).map(group => group.buttons).flat())
  return shortcuts
}

/**
 * Wraps Nuxt UI's defineShortcuts and adds optional keyup handlers.
 * todo: implement options
 */
export function useExtendedShortcuts(
  config: ExtendedShortcutsConfig,
  _options?: DefineShortcutsOptions,
) {
  // Build config for Nuxt UI's defineShortcuts (keydown only)
  const baseConfig: Record<string, any> = {}

  for (const [key, shortcut] of Object.entries(config)) {
    if (typeof shortcut === 'function') {
      baseConfig[key] = shortcut
      continue
    }

    if (!shortcut.keydown) continue

    baseConfig[key] = {
      handler: shortcut.keydown,
      ...(shortcut.usingInput !== undefined ? { usingInput: shortcut.usingInput } : {}),
    }
  }

  // Let Nuxt UI handle keydown
  const stopKeydown = useEventListener(window, 'keydown', (e: KeyboardEvent) => {
    const key = e.key.toLowerCase()

    for (const [shortcutKey, shortcut] of Object.entries(config)) {
      if (typeof shortcut === 'function') {
        continue
      }

      if (!shortcut.keydown) continue

      const split = shortcutKey.toLowerCase().split('_')
      // console.log('split:', split)

      const mainKey = split
        .filter(k => !['meta', 'command', 'ctrl', 'shift', 'alt', 'option'].includes(k))
        .join('_')

      const needsMeta = split.includes('meta') || split.includes('command')
      const needsCtrl = split.includes('ctrl')
      const needsShift = split.includes('shift')
      const needsAlt = split.includes('alt') || split.includes('option')

      if (mainKey && key !== mainKey) {
        // console.log('key:', key)
        // console.log('mainKey:', mainKey)
        // console.log('(mainKey && key !== mainKey)')
        continue
      }
      if (needsMeta && !e.metaKey) {
        // console.log('(needsMeta && !e.metaKey)')
        continue
      }
      if (!needsMeta && e.metaKey) {
        // console.log('(!needsMeta && e.metaKey)')
        continue
      }
      if (needsCtrl && !e.ctrlKey) {
        // console.log('(needsCtrl && !e.ctrlKey)')
        continue
      }
      if (!needsCtrl && e.ctrlKey) {
        // console.log('(!needsCtrl && e.ctrlKey)')
        continue
      }
      if (needsShift && !e.shiftKey) {
        // console.log('(needsShift && !e.shiftKey)')
        continue
      }
      if (!needsShift && e.shiftKey) {
        // console.log('(!needsShift && e.shiftKey)')
        continue
      }
      if (needsAlt && !e.altKey) {
        // console.log('(needsAlt && !e.altKey)')
        continue
      }
      if (!needsAlt && e.altKey) {
        // console.log('(!needsAlt && e.altKey)')
        continue
      }

      // console.log('beforeKeydown')
      shortcut.keydown(e)
    }
  })

  // Handle keyup ourselves
  const stopKeyup = useEventListener(window, 'keyup', (e: KeyboardEvent) => {
    const key = e.key.toLowerCase()
    // console.log('key:', key)

    for (const [shortcutKey, shortcut] of Object.entries(config)) {
      if (typeof shortcut === 'function') {
        continue
      }

      if (!shortcut.keyup) continue

      const split = shortcutKey.toLowerCase().split('_')
      // console.log('split:', split)

      const mainKey = split
        .filter(k => !['meta', 'command', 'ctrl', 'shift', 'alt', 'option'].includes(k))
        .join('_')

      // const needsMeta = split.includes('meta') || split.includes('command')
      // const needsCtrl = split.includes('ctrl')
      // const needsShift = split.includes('shift')
      // const needsAlt = split.includes('alt') || split.includes('option')

      if (mainKey && key !== mainKey) continue
      // if (needsMeta && !e.metaKey) continue
      // if (!needsMeta && e.metaKey) continue
      // if (needsCtrl && !e.ctrlKey) continue
      // if (!needsCtrl && e.ctrlKey) continue
      // if (needsShift && !e.shiftKey) continue
      // if (!needsShift && e.shiftKey) continue
      // if (needsAlt && !e.altKey) continue
      // if (!needsAlt && e.altKey) continue

      shortcut.keyup(e)
    }
  })

  // mirror Nuxt UI: return a stop function
  return () => {
    stopKeydown()
    stopKeyup()
  }
}