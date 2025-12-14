import {type ModelRef, ref, watch} from "vue"

export const useEditorGrid = (
  {
    snap,
    scale
  }: {
    snap: ModelRef<boolean>
    scale: ModelRef<number>
  }) => {
  const scaleThreshold = ref<'sm' | 'md' | 'lg'>('lg')
  const gridSnapSize = ref(0)
  const gridSize = 100
  const gridExtent = 10000

  watch(scale, () => {
    let threshold: 'sm' | 'md' | 'lg'
    let size: number

    switch (true) {
      case scale.value >= 1 && scale.value < 1.5:
        threshold = 'md'
        size = 25
        break

      case scale.value >= 1.5:
        threshold = 'sm'
        size = 10
        break

      default:
        threshold = 'lg'
        size = 100
    }

    scaleThreshold.value = threshold
    gridSnapSize.value = snap.value ? size : 0
  }, {
    immediate: true,
  })

  return {
    scaleThreshold,
    gridSnapSize,
    gridSize,
    gridExtent,
  }
}