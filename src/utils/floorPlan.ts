import type {Room, Section} from "@/types/floorPlan.ts";
import {uid} from "@/utils/ids.ts";

export function createSection(section: Partial<Section> = {}): Section {
  return {
    id: uid(),
    shape: 'rectangle',
    polygon: [
      { x: 0, y: 0 },
      { x: 0, y: 300 },
      { x: 300, y: 300 },
      { x: 300, y: 0 },
    ],
    offset: { x: 0, y: 0 },
    ...section
  }
}

export function createRoom(room: Partial<Room> = {}): Room {
  return {
    id: uid(),
    heightM: 3,
    sections: room.sections ?? [createSection()],
    labels: [
      {
        id: uid(),
        x: 100,
        y: 100,
        text: '',
      }
    ],
    openings: [],
    offset: { x: 0, y: 0 },
    ...room,
  }
}