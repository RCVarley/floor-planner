import { defineStore } from 'pinia'
import {ref} from "vue"

export const useDevStore = defineStore('dev', () => {
  const isDebug = ref(true)
  return {
    isDebug,
  }
})