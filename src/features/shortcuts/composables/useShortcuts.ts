import { ref, computed, toValue } from 'vue'
import type { MaybeRef } from 'vue'
import { useEventListener, useActiveElement, useDebounceFn } from '@vueuse/core'
import { useKbd } from './useKbd.ts'
import type {ToolbarButtonGroup} from '@editor/types/toolbarButton.ts'

type Handler = (e?: any) => void

type ShortcutHandlers = {
  handler: Handler
  keyup?: never
  keydown?: never
} | {
  handler?: never
  keyup: Handler
  keydown?: Handler
} | {
  handler?: never
  keyup?: Handler
  keydown: Handler
}

export type ShortcutConfig = ShortcutHandlers & {
  usingInput?: string | boolean
}

export interface ShortcutsConfig {
  [key: string]: ShortcutConfig | Handler | false | null | undefined
}

export interface ShortcutsOptions {
  chainDelay?: number
  layoutIndependent?: boolean
}

interface Shortcut {
  handler?: Handler
  keyup?: Handler
  keydown?: Handler
  enabled: boolean
  chained: boolean
  // KeyboardEvent attributes
  key: string
  ctrlKey: boolean
  metaKey: boolean
  shiftKey: boolean
  altKey: boolean
}

const chainedShortcutRegex = /^[^-]+.*-.*[^-]+$/
const combinedShortcutRegex = /^[^_]+.*_.*[^_]+$/
// keyboard keys, which can be combined with Shift modifier (in addition to alphabet keys)
const shiftableKeys = ['arrowleft', 'arrowright', 'arrowup', 'arrowright', 'tab', 'escape', 'enter', 'backspace']

// Simple key to code conversion for layout independence
function convertKeyToCode(key: string): string {
  // Handle single letters
  if (/^[a-z]$/i.test(key)) {
    return `Key${key.toUpperCase()}`
  }
  // Handle digits
  if (/^\d$/.test(key)) {
    return `Digit${key}`
  }
  // Handle function keys
  if (/^f\d+$/i.test(key)) {
    return key.toUpperCase()
  }
  // Handle common special keys
  const specialKeys: Record<string, string> = {
    space: 'Space',
    enter: 'Enter',
    escape: 'Escape',
    tab: 'Tab',
    backspace: 'Backspace',
    delete: 'Delete',
    arrowup: 'ArrowUp',
    arrowdown: 'ArrowDown',
    arrowleft: 'ArrowLeft',
    arrowright: 'ArrowRight'
  }
  return specialKeys[key.toLowerCase()] || key
}

export function extractShortcutsFromToolbarGroups(...groups: ToolbarButtonGroup[]) {
  const shortcuts: Record<string, Handler> = {}

  groups.forEach(({ buttons }) => {
    buttons.forEach(button => {
      if (button.kbds?.length && button.onClick) {
        const shortcutKey = button.kbds.join('_')
        shortcuts[shortcutKey] = button.onClick
      }
    })
  })

  return shortcuts
}

export function extractShortcuts(items: any[] | any[][], separator: '_' | '-' = '_') {
  const shortcuts: Record<string, Handler> = {}

  function traverse(items: any[]) {
    items.forEach((item) => {
      if (item.kbds?.length && (item.onSelect || item.onClick)) {
        const shortcutKey = item.kbds.join(separator)
        shortcuts[shortcutKey] = item.onSelect || item.onClick
      }
      if (item.children) {
        traverse(item.children.flat())
      }
      if (item.items) {
        traverse(item.items.flat())
      }
    })
  }

  traverse(items.flat())

  return shortcuts
}

export function useShortcuts(config: MaybeRef<ShortcutsConfig>, options: ShortcutsOptions = {}) {
  const chainedInputs = ref<string[]>([])
  const clearChainedInput = () => {
    chainedInputs.value.splice(0, chainedInputs.value.length)
  }
  const debouncedClearChainedInput = useDebounceFn(clearChainedInput, options.chainDelay ?? 800)

  const { macOS } = useKbd()
  const activeElement = useActiveElement()
  const layoutIndependent = options.layoutIndependent ?? false

  // precompute shiftable codes if layoutIndependent
  const shiftableCodes = shiftableKeys.map(k => convertKeyToCode(k))

  const onKeyEvent = (e: KeyboardEvent, fireHandler: (shortcut: Shortcut) => void) => {
    // Input autocomplete triggers a keydown event
    if (!e.key) {
      return
    }

    const alphabetKey = layoutIndependent ? /^Key[A-Z]$/i.test(e.code) : /^[a-z]$/i.test(e.key)
    const shiftableKey = layoutIndependent ? shiftableCodes.includes(e.code) : shiftableKeys.includes(e.key.toLowerCase())

    let chainedKey
    // push either code or key depending on layoutIndependent flag
    chainedInputs.value.push(layoutIndependent ? e.code : e.key)
    // try matching a chained shortcut
    if (chainedInputs.value.length >= 2) {
      chainedKey = chainedInputs.value.slice(-2).join('-')

      for (const shortcut of shortcuts.value.filter(s => s.chained)) {
        if (shortcut.key !== chainedKey) {
          continue
        }

        if (shortcut.enabled) {
          e.preventDefault()
          fireHandler(shortcut)
        }
        clearChainedInput()
        return
      }
    }

    // try matching a standard shortcut
    for (const shortcut of shortcuts.value.filter(s => !s.chained)) {
      if (layoutIndependent) {
        // compare by code
        if (e.code !== shortcut.key) {
          continue
        }
      } else {
        if (e.key.toLowerCase() !== shortcut.key) {
          continue
        }
      }

      if (e.metaKey !== shortcut.metaKey) {
        continue
      }
      if (e.ctrlKey !== shortcut.ctrlKey) {
        continue
      }
      // shift modifier is only checked in combination with alphabet keys and some extra keys
      // (shift with special characters would change the key)
      if ((alphabetKey || shiftableKey) && e.shiftKey !== shortcut.shiftKey) {
        continue
      }

      if (shortcut.enabled) {
        e.preventDefault()
        fireHandler(shortcut)
      }
      clearChainedInput()
      return
    }

    debouncedClearChainedInput()
  }

  const onKeyDown = (e: KeyboardEvent) => onKeyEvent(e, (shortcut) => {
    if (shortcut.handler) {
      shortcut.handler(e)
    }
    else if (shortcut.keydown) {
      shortcut.keydown(e)
    }
  })

  const onKeyUp = (e: KeyboardEvent) => onKeyEvent(e, (shortcut) => {
    if (shortcut.keyup) {
      shortcut.keyup(e)
    }
  })

  const usingInput = computed(() => {
    const tagName = activeElement.value?.tagName
    const contentEditable = activeElement.value?.contentEditable

    const usingInput = tagName === 'INPUT' || tagName === 'TEXTAREA' || contentEditable === 'true' || contentEditable === 'plaintext-only'

    if (usingInput) {
      return ((activeElement.value as any)?.name as string) || true
    }

    return false
  })

  // Map config to full detailed shortcuts
  const shortcuts = computed<Shortcut[]>(() => {
    return Object.entries(toValue(config)).map(([key, shortcutConfig]) => {
      if (!shortcutConfig) {
        return null
      }

      // Parse key and modifiers
      let shortcut: Partial<Shortcut>

      if (key.includes('-') && key !== '-' && !key.includes('_') && !key.match(chainedShortcutRegex)?.length) {
        console.trace(`[Shortcut] Invalid key: "${key}"`)
      }

      if (key.includes('_') && key !== '_' && !key.match(combinedShortcutRegex)?.length) {
        console.trace(`[Shortcut] Invalid key: "${key}"`)
      }

      const chained = key.includes('-') && key !== '-' && !key.includes('_')
      if (chained) {
        // convert each part to code if layoutIndependent, otherwise keep raw key
        if (layoutIndependent) {
          const parts = key.split('-').map(p => convertKeyToCode(p))
          shortcut = {
            key: parts.join('-'),
            metaKey: false,
            ctrlKey: false,
            shiftKey: false,
            altKey: false
          }
        } else {
          shortcut = {
            key: key.toLowerCase(),
            metaKey: false,
            ctrlKey: false,
            shiftKey: false,
            altKey: false
          }
        }
      } else {
        const keySplit = key.toLowerCase().split('_').map(k => k)
        let baseKey = keySplit.filter(k => !['meta', 'command', 'ctrl', 'shift', 'alt', 'option'].includes(k)).join('_')
        if (layoutIndependent) {
          baseKey = convertKeyToCode(baseKey)
        }
        shortcut = {
          key: baseKey,
          metaKey: keySplit.includes('meta') || keySplit.includes('command'),
          ctrlKey: keySplit.includes('ctrl'),
          shiftKey: keySplit.includes('shift'),
          altKey: keySplit.includes('alt') || keySplit.includes('option')
        }
      }
      shortcut.chained = chained

      // Convert Meta to Ctrl for non-macOS
      if (!macOS.value && shortcut.metaKey && !shortcut.ctrlKey) {
        shortcut.metaKey = false
        shortcut.ctrlKey = true
      }

      // Retrieve handler function
      if (typeof shortcutConfig === 'function') {
        shortcut.handler = shortcutConfig
      } else if (typeof shortcutConfig === 'object') {
        shortcut = {
          ...shortcut,
          handler: shortcutConfig.handler,
          keyup: shortcutConfig.keyup,
          keydown: shortcutConfig.keydown,
        }
      }

      if (!shortcut.handler && !shortcut.keydown && !shortcut.keyup) {
        console.trace('[Shortcut] Invalid value')
        return null
      }

      let enabled = true
      if (!(shortcutConfig as ShortcutConfig).usingInput) {
        enabled = !usingInput.value
      } else if (typeof (shortcutConfig as ShortcutConfig).usingInput === 'string') {
        enabled = usingInput.value === (shortcutConfig as ShortcutConfig).usingInput
      }
      shortcut.enabled = enabled

      return shortcut
    }).filter(Boolean) as Shortcut[]
  })

  return {
    stopKeyDown: useEventListener('keydown', onKeyDown),
    stopKeyUp: useEventListener('keyup', onKeyUp),
  }
}