// import AppConfig from '@/app.config.ts'
// import {computed, type Ref} from 'vue'
//
// const icons = AppConfig.ui.icons;
//
// const limits = {
//   // triangle: 3,
//   rectangle: 2,
//   // pentagon: 5,
//   // hexagon: 6,
//   // heptagon: 7,
//   // octagon: 8,
//   // nonagon: 9,
//   // decagon: 10,
//   // enneagon: 11,
//   // dodecagon: 12,
// }
//
// export const useEditorDraw = (
//   {
//     mousePosition,
//   }: {
//     mousePosition: Ref<Point | null>
//     entityStates: EditorEntityStates
//     selectedEntity: ComputedRef<EditorSelectedEntity | null>
//     addEntity: (entity: BaseFloorPlanEntity) => void
//   }
// ) => {
//   const { debugData } = useDebug()
//   const drawMode = ref<EditorDrawMode | null>(null)
//   const drawingPoints = ref<Point[]>([])
//
//   // const cursorLine = computed(() => {
//   //   if (
//   //     !drawingPoints.value.length
//   //     || !mousePosition.value
//   //     || (
//   //       (drawMode.value !== 'polygon' && !drawingPoints.value.length)
//   //       && (drawMode.value !== 'triangle' && drawingPoints.value.length > 1)
//   //     )
//   //   ) {
//   //     return null
//   //   }
//   //
//   //   const { x: x1, y: y1 } = drawingPoints.value.at(-1)!
//   //   const { x: x2, y: y2 } = mousePosition.value
//   //
//   //   return { x1, y1, x2, y2 }
//   // })
//
//   const cursorRect = computed(() => {
//     if (!mousePosition.value || drawMode.value !== 'rectangle' || drawingPoints.value.length !== 1) {
//       return null
//     }
//
//     const { x, y } = drawingPoints.value.at(0)!
//     const { x: mx, y: my } = mousePosition.value!
//     return {
//       x,
//       y,
//       width: x + (mx - x),
//       height: y + (my - y),
//     }
//   })
//
//   const addDrawingPoint = (point: Point) => drawingPoints.value.push(point)
//   const clearDrawingPoints = () => drawingPoints.value = []
//
//   const onDraw = () => {
//     console.group('onDraw')
//     debugData.value.drawingPoints = drawingPoints.value
//     if (!drawMode.value || !mousePosition.value) {
//       console.groupEnd()
//       return
//     }
//
//     // if (drawMode.value === 'polygon') {
//     //   if (drawingPoints.value.length > 1 && matchPoints(drawingPoints.value.at(0)!, drawingPoints.value.at(-1)!)) {
//     //     drawEntityWrapper([...drawingPoints.value])
//     //   }
//     //   else {
//     //     addDrawingPoint(mousePosition.value)
//     //   }
//     //
//     //   console.groupEnd()
//     //   return
//     // }
//
//     const limit = limits[drawMode.value as keyof typeof limits]
//
//     if (!limit) {
//       throw new NamedError('shape:create:bad-parameters', `Expected triangle, rectangle or polygon, got ${drawMode.value}`)
//     }
//
//     addDrawingPoint(mousePosition.value)
//     if (drawingPoints.value.length === limit) {
//       drawEntityWrapper([...drawingPoints.value])
//     }
//
//     console.groupEnd()
//     return
//   }
//
//   return {
//     // cursorLine,
//     cursorRect,
//     drawMode,
//     onDraw,
//   }
// }