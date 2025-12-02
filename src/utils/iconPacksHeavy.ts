import Lucide from "@iconify-json/lucide/icons.json";
import FontAwesomeBrands from "@iconify-json/fa6-brands/icons.json";
import StreamlinePixel from "@iconify-json/streamline-pixel/icons.json";
import Material from "@iconify-json/mdi/icons.json";

export type LucideIconNames = keyof typeof Lucide.icons // | keyof typeof LucideAliases
export type FontAwesomeBrandsIconNames = keyof typeof FontAwesomeBrands.icons // | keyof typeof FontAwesomeBrandsAliases
export type StreamlinePixelIconNames = keyof typeof StreamlinePixel.icons // | keyof typeof StreamlinePixelAliases
export type MaterialIconNames = keyof typeof Material.icons // | keyof typeof LucideAliases

export type IconName =
  | `lucide:${LucideIconNames}`
  | `fa6-brands:${FontAwesomeBrandsIconNames}`
  | `streamline-pixel:${StreamlinePixelIconNames}`
  | `mdi:${MaterialIconNames}`

export {
  Lucide,
  FontAwesomeBrands,
  StreamlinePixel,
  Material,
}