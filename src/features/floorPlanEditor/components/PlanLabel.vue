<script setup lang="ts">
import type {Label} from "@floor-plan/types/label.ts"

const { label } = defineProps<{
  label: Label
}>()

</script>

<template>
  <g class="label">
    <text>{{ label.text }}</text>
  </g>
</template>

<style scoped>

</style>