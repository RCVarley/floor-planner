import type {EnumType} from '@/types/utilities.ts'

export const ValidationMessages = {
  noEmpty: 'Cannot be empty',
} as const

export type ValidationMessages = EnumType<typeof ValidationMessages>