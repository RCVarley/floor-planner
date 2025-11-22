type IsoDateBrand = { __brand: 'IsoDate' }
export type IsoDate = string & IsoDateBrand
const dateRegex = /^\d{2}-\d{2}-\d{4}$/

export function asIsoDate(value: string): IsoDate {
  if (!dateRegex.test(value)) {
    throw new Error(`Invalid ISO date: ${value}`)
  }
  return value as IsoDate
}

type IsoTimeBrand = { __brand: 'IsoTime' }
export type IsoTime = string & IsoTimeBrand
const timeRegex = /^T\d{2}:\d{2}:\d{2}$/

export function asIsoTime(value: string): IsoTime {
  if (!timeRegex.test(value)) {
    throw new Error(`Invalid ISO time: ${value}`)
  }
  return value as IsoTime
}

type IsoDateTimeBrand = { __brand: 'IsoDateTime' }
export type IsoDateTime = string & IsoDateTimeBrand
const dateTimeRegex = /^\d{2}-\d{2}-\d{4}T\d{2}(:\d{2}){0,2}$/

export function asIsoDateTime(value: string): IsoDateTime {
  if (!dateTimeRegex.test(value)) {
    throw new Error(`Invalid ISO date-time: ${value}`)
  }
  return value as IsoDateTime
}