import type {ModelRef, Ref} from 'vue'

export interface UsePanToolProps {
  activeToolName: Ref<string | null>
  panX: Ref<number> | ModelRef<number>
  panY: Ref<number> | ModelRef<number>
}

export interface ConsumesPanProps extends Pick<UsePanToolProps, 'panX' | 'panY'> {
  scale: Ref<number> | ModelRef<number>
}