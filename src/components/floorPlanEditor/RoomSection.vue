<script setup lang="ts">
import type {Point, RoomPlanSection, Section} from "@/types/floorPlan.ts"
import {computed, onMounted, ref, shallowRef, useTemplateRef, watch} from "vue"
import {addPoints, checkIfInside, distanceBetween, polygonArea, snapToGrid, subtractPoints} from "@/utils/points.ts"
import {useEditor} from "@/composables/useEditor.ts"
import {useDraggable} from "@vueuse/core"
import {useDebug} from "@/composables/useDebug.ts"
import type {IHasId} from "@/types/utilities.ts";

const {
  roomOffset,
  selected,
} = defineProps<{
  roomOffset: Point
  selected: boolean
}>()

const model = defineModel<Section>({ required: true })

const {
  basePixelsPerMeter,
  mode,
  nodeRadius,
  gridSnapSize,
  svg,
  mousePosition,
} = useEditor()

const offset = computed({
  get: () => addPoints(roomOffset, model.value.offset),
  set: (value: Point) => model.value.offset = value,
})

const section = computed(() => {
  const polygon = model.value.polygon.map((point) => addPoints(point, offset.value))
  const area = polygonArea(polygon) / Math.pow(basePixelsPerMeter.value, 2)

  // if (polygon.length > 2) {
  //   const [root] = section.polygon
  //   for (let i = 2; i < section.polygon.length; i++) {
  //     const a = section.polygon[i-1]
  //     const b = section.polygon[i]
  //
  //
  //     if (!root || !a || !b) {
  //       throw new Error('Missing polygon')
  //     }
  //
  //
  //
  //     area += triangleArea(root, a, b) / Math.pow(ppm, 2)
  //
  //     console.log({ area, })
  //   }
  // }


  // console.assert(area === polygonArea(section.polygon) / Math.pow(ppm, 2), `area (${area}) doesn't match polygonArea (${polygonArea(section.polygon) / Math.pow(ppm, 2)})`)
  return {
    ...model.value,
    polygon,
    points: polygon.map(p => `${p.x},${p.y}`).join(' '),
    area,
  } as RoomPlanSection
})

const isInside = computed(() => mousePosition.value && checkIfInside(mousePosition.value, section.value.polygon))

// const svgContainer = inject<Readonly<ShallowRef<SVGSVGElement | null>>>('svgContainer')
// const shape = useTemplateRef('shapeRef')
//
// function screenDeltaToSvg(svg: SVGSVGElement, dx: number, dy: number): Point {
//   const ctm = svg.getScreenCTM()
//   if (!ctm) return { x: 0, y: 0 }
//   const inv = ctm.inverse()
//   return {
//     x: dx * inv.a + dy * inv.c,
//     y: dx * inv.b + dy * inv.d
//   }
// }
//
// useDraggable(shape, {
//   containerElement: svgContainer,
//   onMove(e) {
//     if (!svgContainer?.value) return
//
//     const { x, y } = screenDeltaToSvg(svgContainer.value, e.x, e.y)
//     section
//   }
// })
const shape = useTemplateRef('shapeRef')

const drag = shallowRef<ReturnType<typeof useDraggable>>()

interface ClosestNode extends IHasId {
  point: Point
}

const lockedNode = ref<ClosestNode | null>(null)
const closestNode = computed(() => {
  if (lockedNode.value) {
    return lockedNode.value
  }

  if (!mousePosition.value || !showPoints.value || !isInside.value) return null

  let closest: ClosestNode | null = null

  let mouseToClosest: number | null = null
  let i = 0
  for (let point of section.value.polygon) {
    const mouseToPoint = distanceBetween(mousePosition.value, point)
    if (!mouseToClosest || mouseToPoint < mouseToClosest) {
      mouseToClosest = mouseToPoint
      closest = {
        id: section.value.id + i,
        point,
      }
    }
    i++
  }

  return closest
})

let originOffset: Point | null = null
let snappedOriginOffset: Point | null = null
let originMouse: Point | null = null
let lastValidDelta: Point | null = null

const { debugData } = useDebug()

onMounted(() => {
  if (!shape.value) throw new Error('No shape on mount')
  drag.value = useDraggable(shape, {
    containerElement: svg,
    onStart(_element) {
      originOffset = model.value.offset
      snappedOriginOffset = snapToGrid(offset.value, gridSnapSize.value)
      originMouse = mousePosition.value
        ? { x: mousePosition.value.x, y: mousePosition.value.y }
        : null

      lockedNode.value = closestNode.value

      debugData.value.snap = {
        baseOffset: offset.value,
        gridSnapSize: gridSnapSize.value,
        originOffset,
        snappedOriginOffset,
      }
    },
    onMove() {
      if (!svg?.value || mode.value !== 'move' || !mousePosition.value || !originMouse || !originOffset || !snappedOriginOffset) return

      const diffMouse = subtractPoints(mousePosition.value, originMouse)
      const newOffset = addPoints(originOffset, diffMouse)
      const newSnappedOffset = snapToGrid(addPoints(snappedOriginOffset, diffMouse), gridSnapSize.value)

      offset.value = gridSnapSize.value
        ? snapToGrid(newSnappedOffset, gridSnapSize.value)
        : newOffset

      debugData.value.snap = {
        gridSnapSize: gridSnapSize.value,
        originOffset,
        newOffset,
        newSnappedOffset,
      }

      // debugData.value.diffMouse = {
      //   roomOffset,
      //   originMouse,
      //   mouse: mousePosition.value,
      //   diffMouse,
      //   originOffset,
      //   newOffset,
      // }
    },
    onEnd() {
      originOffset = null
      originMouse = null
      snappedOriginOffset = null
      lockedNode.value = null
      if (true || !gridSnapSize.value || !closestNode.value || !svg.value || mode.value !== 'move') return

      const target = snapToGrid(closestNode.value.point, gridSnapSize.value)
      // debugData.value.snap = target
      // debugData.value.closest = closestPoint
      // debugData.value.offset = offset

      const diffX = offset.value.x - target.x
      const diffY = offset.value.y - target.y

      // debugData.value.diff = {
      //   x: diffX,
      //   y: diffY,
      // }

      offset.value = subtractPoints(offset.value, { x: diffX, y: diffY })

      // room.value.offset = {
      //   x: room.value.offset.x + (room.value.offset.x - target.x),
      //   y: room.value.offset.y + (room.value.offset.y - target.y),
      // }
    }
  })
})

const showPoints = computed(() => selected || mode.value === 'select' || mode.value === 'move')

watch([
  isInside,
  closestNode,
  lockedNode
], ([
  inside,
  closest,
  locked,
]) => {
  // debugData.value.isInside = inside
  // debugData.value.closestNode = closest
  // debugData.value.lockedNode = locked
})
</script>

<template>
  <polygon
    ref="shapeRef"
    :points="section.points"
    class="fill-black/10 duration-200 ease-in-out stroke-5 stroke-black/70"
    :class="{
      'hover:fill-black/15 hover:stroke-black/100': mode !== 'pan',
    }"
    stroke="black"
    stroke-width="1"
    vector-effect="non-scaling-stroke"
  />

  <circle
    v-for="(point, pointIndex) in section.polygon"
    :key="section.id + pointIndex"
    :cx="point.x"
    :cy="point.y"
    :r="nodeRadius"
    vector-effect="non-scaling-stroke"
    class="fill-blue-600 hover:fill-red-500"
    :class="{
      'hidden': !showPoints,
      'stroke-red-500 stroke-2': showPoints && closestNode?.id === (section.id + pointIndex),
    }"
  />
</template>

<style scoped>

</style>