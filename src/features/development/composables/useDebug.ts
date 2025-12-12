import {onBeforeUnmount, ref} from "vue";

const debugData = ref<Record<string, any>>({})

export function useDebug() {
  function clearDebugData() {
    debugData.value = {}
  }

  onBeforeUnmount(() => {
    clearDebugData()
  })

  return {
    debugData,
    clearDebugData,
  }
}