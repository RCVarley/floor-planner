import {computed, type ComputedRef, ref, type Ref} from "vue";
import type {EditorDrawMode, ToolName, EditorSelectedEntity, Point} from "@/types/svgEditor.ts";
import {matchPoints} from "@/utils/points.ts";
import {NamedError, type Result} from "@/utils/errorHandling.ts";
import {brandedId} from "@/utils/ids.ts";
import type {ToolbarButtonGroup} from "@/types/toolbarButton.ts";
import AppConfig from "@/app.config.ts";
import type {EditorEntityStates} from "@/components/floorPlanEditor/FloorPlanEditor.vue";
import type {BaseFloorPlanEntity, EntityTypeName} from "@/types/floorPlanEntities/floorPlan.ts";
import {createBuilding, createFloor, createRectangularSection, createRoom} from "@/utils/floorPlan.ts";
import type {Building} from "@/types/floorPlanEntities/building.ts";
import type {Floor} from "@/types/floorPlanEntities/floor.ts";
import type {RectangularSection} from "@/types/floorPlanEntities/section.ts";
import {useDebug} from "@/composables/useDebug.ts";

const icons = AppConfig.ui.icons;

const limits = {
  triangle: 3,
  rectangle: 2,
  // pentagon: 5,
  // hexagon: 6,
  // heptagon: 7,
  // octagon: 8,
  // nonagon: 9,
  // decagon: 10,
  // enneagon: 11,
  // dodecagon: 12,
}

export const useEditorDraw = (
  {
    mode,
    mousePosition,
    entityStates,
    selectedEntity,
    addEntity,
  }: {
    mode: Ref<ToolName>
    mousePosition: Ref<Point | null>
    entityStates: EditorEntityStates
    selectedEntity: ComputedRef<EditorSelectedEntity | null>
    addEntity: (entity: BaseFloorPlanEntity) => void
  }
) => {
  const { debugData } = useDebug()
  const drawMode = ref<EditorDrawMode | null>(null)
  const drawingPoints = ref<Point[]>([])

  const cursorLine = computed(() => {
    if (
      !drawingPoints.value.length
      || !mousePosition.value
      || (
        (drawMode.value !== 'polygon' && !drawingPoints.value.length)
        && (drawMode.value !== 'triangle' && drawingPoints.value.length > 1)
      )
    ) {
      return null
    }

    const { x: x1, y: y1 } = drawingPoints.value.at(-1)!
    const { x: x2, y: y2 } = mousePosition.value

    return { x1, y1, x2, y2 }
  })

  const cursorRect = computed(() => {
    if (!mousePosition.value || drawMode.value !== 'rectangle' || drawingPoints.value.length !== 1) {
      return null
    }

    const { x, y } = drawingPoints.value.at(0)!
    const { x: mx, y: my } = mousePosition.value!
    return {
      x,
      y,
      width: x + (mx - x),
      height: y + (my - y),
    }
  })

  const addDrawingPoint = (point: Point) => drawingPoints.value.push(point)
  const clearDrawingPoints = () => drawingPoints.value = []

  const drawEntityType = ref<EntityTypeName | null>(null)
  let drawEntity: (null | ((points: Point[]) => Result<BaseFloorPlanEntity>)) = null
  const drawEntityWrapper = (points: Point[]) => {
    console.group('drawEntityWrapper')
    if (!drawEntity) {
      throw new NamedError('entity:create:not-found', 'Couldn\'t find drawEntity function.')
    }

    const { error, data } = drawEntity(points)
    if (error) {
      throw error
    }

    addEntity(data)

    clearDrawingPoints()
    console.groupEnd()
  }


  const onDraw = () => {
    console.group('onDraw')
    debugData.value.drawingPoints = drawingPoints.value
    if (!drawMode.value || !mousePosition.value) {
      console.groupEnd()
      return
    }

    if (drawMode.value === 'polygon') {
      if (drawingPoints.value.length > 1 && matchPoints(drawingPoints.value.at(0)!, drawingPoints.value.at(-1)!)) {
        drawEntityWrapper([...drawingPoints.value])
      }
      else {
        addDrawingPoint(mousePosition.value)
      }

      console.groupEnd()
      return
    }

    const limit = limits[drawMode.value as keyof typeof limits]

    if (!limit) {
      throw new NamedError('shape:create:bad-parameters', `Expected triangle, rectangle or polygon, got ${drawMode.value}`)
    }

    addDrawingPoint(mousePosition.value)
    if (drawingPoints.value.length === limit) {
      drawEntityWrapper([...drawingPoints.value])
    }

    console.groupEnd()
    return
  }

  const drawToolbarButtons:ToolbarButtonGroup[] = [
    {
      id: brandedId('Structural'),
      name: 'Structural',
      buttons: [
        {
          id: brandedId('Building'),
          label: 'Building',
          kbds: ['r'],
          icon: icons.building,
          active: computed(() => drawEntityType.value === 'Building'),
          onClick: () => {
            mode.value = 'draw'
            drawMode.value = 'rectangle'
            drawEntityType.value = 'Building'

            drawEntity = (points: Building["points"]) => {
              const activeBuildingId = entityStates.activeBuilding.value
              return createBuilding({
                points,
                parent: activeBuildingId
                  ? {
                    id: activeBuildingId,
                    type: "Building",
                  }
                  : null
              })

            }
          },
        },
        {
          id: brandedId('Floor'),
          label: 'Floor',
          kbds: ['alt_f'],
          icon: icons.floor,
          active: computed(() => drawEntityType.value === 'Floor'),
          onClick: () => {
            mode.value = 'draw'
            drawMode.value = 'rectangle'

            drawEntity = (points: Floor["points"]) => {
              const activeFloorId = entityStates.activeBuilding.value
              return createFloor({
                points,
                parent: activeFloorId
                  ? {
                    id: activeFloorId,
                    type: "Building",
                    }
                  : null
              })
            }
          },
          hidden: entityStates.notHasBuildings,
        },
        {
          id: brandedId('Room'),
          label: 'Room',
          kbds: ['r'],
          icon: icons.room,
          active: computed(() => drawEntityType.value === 'Room'),
          onClick: () => {
            mode.value = 'draw'
            drawMode.value = 'rectangle'

            drawEntity = (points: Point[]) => {
              const activeFloorId = entityStates.activeFloor.value

              const { error, data } = createRoom({
                points,
                parent: activeFloorId
                  ? {
                    id: activeFloorId,
                    type: "Floor",
                  }
                  : null,
                sectionIds: []
              })

              if (error) {
                throw error
              }

              addEntity(data)

              return createRectangularSection({
                points: points as RectangularSection['points'],
                parent: {
                  id: data.id,
                  type: 'Room'
                }
              })
            }
          },
          hidden: entityStates.notHasFloors,
        },
      ],
    },
    {
      id: brandedId('Fixtures'),
      name: 'Fixtures',
      hidden: entityStates.notHasRooms,
      buttons: [
        {
          id: brandedId('Radiator'),
          label: 'Radiator',
          kbds: ['f', 'r'],
          icon: icons.radiator,
          active: computed(() => drawEntityType.value === 'Fixture'),
          onClick: () => {
            mode.value = 'draw'
            drawMode.value = 'point'
          },
        }
      ]
    },
    {
      id: brandedId('Sections'),
      name: 'Room sections',
      buttons: [
      {
        id: brandedId('Rectangle'),
        label: 'Rectangle',
        kbds: ['r'],
        icon: icons.rectangle,
        active: computed(() => drawEntityType.value === 'Section'),
        onClick: () => {
          mode.value = 'draw'
          drawMode.value = 'rectangle'
        },
        hidden: entityStates.notHasRooms,
      },
    ],
      hidden: computed(() => selectedEntity.value?.type !== 'Room'),
    }
  ]

  return {
    cursorLine,
    cursorRect,
    drawMode,
    onDraw,
    drawToolbarButtons,
  }
}