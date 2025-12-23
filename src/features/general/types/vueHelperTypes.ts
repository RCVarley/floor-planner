import type {
  ComputedRef,
  ModelRef,
  Ref,
} from 'vue'

export type CssClassObject = { [key: string]: boolean }
export type CssClasses = string | CssClassObject | Array<string | CssClassObject>
export type SomeRef<T> = Ref<T> | ModelRef<T> | ComputedRef<T>