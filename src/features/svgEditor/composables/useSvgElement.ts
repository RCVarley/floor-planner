import {computed} from 'vue'
import type {SomeRef} from '@/features/general/types/vueHelperTypes.ts'

export const useSvgElement = (
  {
    moveX,
    moveY,
  }: {
    moveX: SomeRef<number | undefined>
    moveY: SomeRef<number | undefined>
  }
) => {
  const move = computed(() => {
    if (!moveX.value && !moveY.value) {
      return {}
    }

    const x = moveX.value ? moveX.value : 0
    const y = moveY.value ? moveY.value : 0

    return {
      transform: `translate(${x}px,${y}px)`
    }
  })

  return {
    move
  }
}