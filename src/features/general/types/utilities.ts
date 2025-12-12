import type {IsoDateTime} from "@/features/general/utilities/dateHelpers.ts";

/**
 * # Unpacked
 * @description The inner type of an array.
 *
 * The difference between this type and `ArrayType[number]`
 * is that Unpacked handles non-arrays gracefully.
 * @template PackageType The type of array/
 * @example
 * const text1: Unpacked<string[]> = 'string'
 * const text2: Unpacked<string> = 'string'
 *
 * const people = [{ name: 'Ryan', dob: '2020-11-11' }]
 * const newPerson: Unpacked<typeof people> = { name: 'Sam', dob: '2020-12-12' }
 */
export type Unpacked<PackageType> = PackageType extends (infer UnpackedType)[] ? UnpackedType : PackageType

/**
 * # Distinct
 * @description Useful for merging objects while maintaining individual keys, this type allows you to prefix
 * keys with a string.
 *
 * @example
 * interface InputProps { id: string; type: 'text' | 'number'; color: 'string' }
 * interface FieldProps { id: string; label: string; color: 'string' }
 *
 * interface InputFieldProps extends InputProps, Distinct<FieldProps, 'field'> {
 *   id: string
 *   type: 'text' | 'number'
 *   color: 'string'
 *
 *   fieldId: string
 *   fieldLabel: string
 *   fieldColor: string
 * }
 */
export type Distinct<BaseType extends Record<string, unknown>, Prefix extends string = 'has'> = {
  [Key in keyof BaseType as `${Prefix}${Capitalize<string & Key>}`]: BaseType[Key]
}

export type Primitive = string | number | symbol | bigint | boolean | null | undefined

/**
 * # NumberString
 * A valid string as a number
 */
export type NumberString = `${number}`

/**
 * # NumberLike
 * Either a number, or a string containing a valid number
 */
export type NumberLike = number | NumberString

/**
 * # EnumType
 * Extract all values from a readonly object
 * @template EnumType The readonly object type that you want to extract values from
 * @example
 * const COLOR = {
 *   PRIMARY: '#332f2f',
 *   SECONDARY: 'cd456b',
 * } as const
 *
 * type ColorEnum = EnumType<typeof COLOR>
 *
 * function setColors(background: ColorEnum, foreground: ColorEnum) { ... }
 * setColors(COLOR.PRIMARY, COLOR.SECONDARY)
 */
export type EnumType<ObjectType extends Readonly<Record<string, unknown>>> = ObjectType[keyof ObjectType]

export type Prettify<T> = {
  [Key in keyof T]: T[Key]
}

export type NullableProps<T> = { [P in keyof T]: T[P] | null}

export interface ICanDisable { disable?: boolean }
export type CanDisable<ObjectType extends Record<string, unknown>> = ICanDisable & ObjectType

export interface ICanHide { hidden?: boolean }
export type CanHide<ObjectType extends Record<string, unknown>> = ICanHide & ObjectType

export interface IHasMessage { message: string }
export type HasMessage<ObjectType> = IHasMessage & ObjectType

export type PartialPick<ObjectType extends Record<PropertyKey, any>, KeyType extends keyof ObjectType> = Partial<ObjectType> & Pick<ObjectType, KeyType>

export type TypedKeys<ObjectType, ValueType> = {
  [Key in keyof ObjectType]: ObjectType[Key] extends (ValueType | null | undefined) ? Key : never
}[keyof ObjectType]

export type IHasId = { id: string }
export type HasId<ObjectType extends Record<string, unknown>> = IHasId & ObjectType

export type StringKeys<ObjectType> = TypedKeys<ObjectType, string>

export type NumericKeys<ObjectType> = TypedKeys<ObjectType, number>

export type BooleanKeys<ObjectType> = TypedKeys<ObjectType, boolean>

export interface IAmTracked {
  created: IsoDateTime
  updated: IsoDateTime | null
}

export interface IHasEmail {
  email: string
}

export interface ICanHasEmail extends Partial<IHasEmail> {}

export interface IHasPhone {
  phone: string
}

export interface ICanHasPhone extends Partial<IHasPhone> {}

export interface IHasStartDateTime {
  start: Date
}

export interface IHasEndDateTime {
  end: Date
}

export interface ICanHasStartDateTime {
  start: Date | null
}

export interface ICanHasEndDateTime {
  end: Date | null
}

export interface ICanHasDateTimes extends ICanHasStartDateTime, ICanHasEndDateTime {}

export type CanHasTimes<T> = T & ICanHasDateTimes