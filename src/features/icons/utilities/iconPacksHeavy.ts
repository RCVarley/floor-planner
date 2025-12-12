import Lucide from "@iconify-json/lucide/icons.json"
import FontAwesomeBrands from "@iconify-json/fa6-brands/icons.json"
import StreamlinePixel from "@iconify-json/streamline-pixel/icons.json"
import Material from "@iconify-json/mdi/icons.json"
import Huge from '@iconify-json/hugeicons/icons.json'

export type LucideIconNames = keyof typeof Lucide.icons
export type FontAwesomeBrandsIconNames = keyof typeof FontAwesomeBrands.icons
export type StreamlinePixelIconNames = keyof typeof StreamlinePixel.icons
export type MaterialIconNames = keyof typeof Material.icons
export type HugeIconNames = keyof typeof Huge.icons

export type IconName =
  | `lucide:${LucideIconNames}`
  | `fa6-brands:${FontAwesomeBrandsIconNames}`
  | `streamline-pixel:${StreamlinePixelIconNames}`
  | `mdi:${MaterialIconNames}`
  | `hugeicons:${HugeIconNames}`

export {
  Lucide,
  FontAwesomeBrands,
  StreamlinePixel,
  Material,
  Huge,
}