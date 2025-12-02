import type { EnumType } from '../types/utilities.ts'
import type { IconifyIcon } from '@iconify/types'
import {addIcon, buildIcon, type IconifyIconBuildResult} from '@iconify/vue'
import {
  FontAwesomeBrands,
  Lucide,
  Material,
  StreamlinePixel,
  type FontAwesomeBrandsIconNames,
  type LucideIconNames,
  type MaterialIconNames,
  type StreamlinePixelIconNames,
  type IconName,
} from "./iconPacksHeavy.ts";

export const IconProvider = {
  lucide: 'lucide',
  fontAwesomeBrands: 'fa6-brands',
  streamlinePixel: 'streamline-pixel',
  material: 'mdi',
} as const

export type IconProvider = EnumType<typeof IconProvider>

export type IconRegister = Partial<Record<string, IconName>>

// const breaker = buildIcon(LucideIcons.beaker)
// addIcon('beaker', breaker)

export const nuxtUiIcons = {
  arrowDown: 'lucide:arrow-down',
  arrowLeft: 'lucide:arrow-left',
  arrowRight: 'lucide:arrow-right',
  arrowUp: 'lucide:arrow-up',
  caution: 'lucide:circle-alert',
  check: 'lucide:check',
  chevronDoubleLeft: 'lucide:chevrons-left',
  chevronDoubleRight: 'lucide:chevrons-right',
  chevronDown: 'lucide:chevron-down',
  chevronLeft: 'lucide:chevron-left',
  chevronRight: 'lucide:chevron-right',
  chevronUp: 'lucide:chevron-up',
  close: 'lucide:x',
  copy: 'lucide:copy',
  copyCheck: 'lucide:copy-check',
  dark: 'lucide:moon',
  ellipsis: 'lucide:circle-ellipsis',
  error: 'lucide:circle-x',
  external: 'lucide:arrow-up-right',
  eye: 'lucide:eye',
  eyeOff: 'lucide:eye-off',
  file: 'lucide:file',
  folder: 'lucide:folder',
  folderOpen: 'lucide:folder-open',
  hash: 'lucide:hash',
  info: 'lucide:info',
  light: 'lucide:sun',
  loading: 'lucide:loader-circle',
  menu: 'lucide:menu',
  minus: 'lucide:minus',
  panelClose: 'lucide:panel-left-close',
  panelOpen: 'lucide:panel-left-open',
  plus: 'lucide:plus',
  reload: 'lucide:rotate-ccw',
  search: 'lucide:search',
  stop: 'lucide:square',
  success: 'lucide:circle-check',
  system: 'lucide:monitor',
  tip: 'lucide:lightbulb',
  upload: 'lucide:upload',
  warning: 'lucide:triangle-alert'
} as const

export const iconDefinitions = {
  ...nuxtUiIcons,
  github: 'fa6-brands:github',
  bug: 'lucide:bug',
  bugOff: 'lucide:bug-off',
  dashboard: 'lucide:layout-dashboard',
  projects: 'lucide:file-stack',
  logo: 'streamline-pixel:building-real-eastate-project-blueprint',
  floorPlan: 'streamline-pixel:building-real-eastate-project-blueprint',
  client: 'lucide:square-user-round',
  hand: 'lucide:hand',
  move: 'lucide:move',
  cursor: 'lucide:mouse-pointer',
  text: 'lucide:text-cursor',
  delete: 'lucide:trash',
  edit: 'lucide:pencil',
  add: 'lucide:plus',
  save: 'lucide:save',
  cancel: 'lucide:x',
  close: 'lucide:x',
  flask: 'lucide:flask-conical',
  arrowDown: 'lucide:arrow-down',
  arrowUp: 'lucide:arrow-up',
  arrowLeft: 'lucide:arrow-left',
  arrowRight: 'lucide:arrow-right',
  refresh: 'lucide:refresh-cw',
  building: 'lucide:house',
  floor: 'lucide:align-vertical-justify-end',
  room: 'lucide:panels-right-bottom',
  rectangle: 'lucide:rectangle-horizontal',
  triangle: 'lucide:triangle-right',
  window: 'mdi:window-open-variant',
  radiator: 'mdi:radiator',
  vent: 'mdi:view-sequential-outline',
  extractor: 'mdi:fan',
  door: 'mdi:door-open',
} as const



function updateIcon(
  iconData: IconifyIconBuildResult,
  { width, height }: { width: number, height: number }
): IconifyIcon {
  iconData.viewBox = [0, 0, width, height]
  iconData.attributes.width = width.toString()
  iconData.attributes.height = height.toString()
  iconData.attributes.viewBox = `0 0 ${width} ${height}`

  return {
    ...iconData,
    width: width,
    height: height,
    top: 0,
    left: 0,
  }
}

/**
 * # registerIcon
 * @description Registers an icon with the Iconify library.
 * @param icon
 */
export async function registerIcon(icon: IconName) {
  const [provider, name] = icon.split(':') as [
    provider: IconProvider,
    name: LucideIconNames | FontAwesomeBrandsIconNames | StreamlinePixelIconNames
  ]

  if (!name) {
    throw new Error(`Missing icon name: ${icon}`)
  }

  let iconData: IconifyIconBuildResult
  switch (provider) {
    case IconProvider.lucide:
      iconData = buildIcon(Lucide.icons[name as LucideIconNames], {
        width: Lucide.width,
        height: Lucide.height,
      })

      iconData.attributes
      break

    case IconProvider.fontAwesomeBrands:
      iconData = buildIcon(FontAwesomeBrands.icons[name as FontAwesomeBrandsIconNames], {
        width: FontAwesomeBrands.width,
        height: FontAwesomeBrands.height,
      })
      break

    case IconProvider.streamlinePixel:
      iconData = buildIcon(StreamlinePixel.icons[name as StreamlinePixelIconNames], {
        width: StreamlinePixel.width,
        height: StreamlinePixel.height,
      })
      break

    case IconProvider.material:
      iconData = buildIcon(Material.icons[name as MaterialIconNames], {
        width: Material.width,
        height: Material.height,
      })
      break

    default:
      throw new Error(`Unknown icon provider: ${provider}`)
  }

  addIcon(icon, updateIcon(iconData, {
    width: Number(iconData.attributes.width),
    height: Number(iconData.attributes.height),
  }))

  // if (error) {
  //   console.error(error)
  //   console.error(`Failed to load icon: '${icon}' from: '@iconify-icons/${provider}/${name}.js'`)
  //   // throw new Error(`Failed to load icon: '${icon}'`)
  // }
  //
  // addIcon(icon, data)
}