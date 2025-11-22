import {
  type MaybeRef,
  unref,
} from "vue"

type Primitive = string | number | boolean | undefined | null

/**
 * Compare primitives
 * @description compares primitive values and produces an output
 *
 * @param first First value to compare
 * @param second Second value to compare
 * @param changesOnly Output undefined if there are no changes
 *
 * @returns A string showing the change, a string containing the value or undefined
 *
 * @example
 * comparePrimitives(1, 1)         // undefined
 * comparePrimitives(1, 1, false)  // "1"
 * comparePrimitives(1, 2)         // "1 --> 2"
 */
function comparePrimitives<T extends Primitive>(first: MaybeRef<T>, second: MaybeRef<T>, changesOnly = true): any {
  const before = unref(first)
  const after = unref(second)

  if (before !== after) {
    return `${before} --> ${after}`
  }

  return changesOnly
    ? undefined
    : String(before)
}

/**
 * Compare arrays
 * @description Compare two lists and get the differences as the output
 *
 * @param first The objects to compare against
 * @param second Objects are compared with firstObject
 * @param changesOnly Output the whole object or, if true, only the changes.
 *
 * @returns A list of objects with all the properties of the two objects passed in, but with the comparisons instead of raw values
 *
 * @example
 * compareArrays(["zero", "one"], ["zero", "one"])         // undefined
 * compareArrays(["zero", "one"], ["zero", "one"], false)  // { 0: "zero", 1: "one" }
 * compareArrays(["zero", "one"], ["zero", "two"])         // { 1: "one --> two" }
 * compareArrays(["zero", "one"], ["zero", "one", "two"])  // { 2: "undefined --> "two" }
 */
function compareArrays<T>(first: MaybeRef<T[]>, second: MaybeRef<T[]>, changesOnly = true): any {
  const before = unref(first) ?? [] as T[]
  const after = unref(second) ?? [] as T[]

  const maxLength = Math.max(before.length, after.length)
  const result = {} as Record<string, any>

  for (let i = 0; i < maxLength; i++) {
    const comparison = compare(before[i], after[i], changesOnly)
    if (comparison !== undefined)
      result[i] = comparison
  }

  return Object.keys(result).length > 0 ? result : undefined
}

/**
 * Compare objects
 * @description Compare two objects and get the differences as the output
 *
 * @param first The object to compare against
 * @param second Object is compared with firstObject
 * @param changesOnly Output the whole object or, if true, only the changes.
 *
 * @returns An object with all the properties of the two objects passed in, but with the comparisons instead of raw values
 *
 * @example
 * compareObjects({ one: 1, two: 2 }, { one: 1, two: 2 })         // undefined
 * compareObjects({ one: 1, two: 2 }, { one: 1, two: 2 }, false)  // { one: "1", two: "2" }
 * compareObjects({ one: 1, two: 2 }, { one: 1, two: 3 })         // { two: "2 --> 3" }
 * compareObjects({ one: 1, two: 2 }, { one: 1, three: 3 })       // { two: "2 --> undefined", three: "undefined --> 3" }
 */
function compareObjects<T extends Record<string, any>>(first: MaybeRef<T>, second: MaybeRef<T>, changesOnly = true): any {
  const before = unref(first) ?? {} as T
  const after = unref(second) ?? {} as T
  const result = {} as Record<string, any>

  for (const key in before) {
    if (Object.prototype.hasOwnProperty.call(before, key)) {
      const comparison = compare(before[key], after[key], changesOnly)
      if (comparison !== undefined)
        result[key] = comparison
    }
  }

  for (const key in after) {
    if (Object.prototype.hasOwnProperty.call(after, key) && !Object.prototype.hasOwnProperty.call(before, key)) {
      const comparison: any = compare(before[key], after[key], changesOnly)
      if (comparison !== undefined)
        result[key] = comparison
    }
  }

  return Object.keys(result).length > 0 ? result : undefined
}

/**
 * Compare
 * @description Compare two items and get the differences as the output.
 * @param first The object to compare against.
 * @param second Object is compared with firstObject.
 * @param changesOnly Output the whole object or, if true, only the changes.
 *
 * @returns An object with all the properties of the two objects passed in, but with the comparisons instead of raw values
 *
 * @example
 * compare(1, 1)         // undefined
 * compare(1, 1, false)  // "1"
 * compare(1, 2)         // "1 --> 2"
 *
 * compare(["zero", "one"], ["zero", "one"])                            // undefined
 * compare(["zero", "one"], ["zero", "one"], false)                     // { 0: "zero", 1: "one" }
 * compare(["zero", "one"], ["zero", "two"])                            // { 1: "one --> two" }
 * compare(["zero", "one"], ["zero", "one", "two"])                     // { 2: "undefined --> "two" }
 * compare({ arr: ["zero", "one"] }, { arr: ["zero", "one-altered"] })  // { arr: { 1: 'one --> one-altered' } }
 *
 * compare({ one: 1, two: 2 }, { one: 1, two: 2 })         // undefined
 * compare({ one: 1, two: 2 }, { one: 1, two: 2 }, false)  // { one: "1", two: "2" }
 * compare({ one: 1, two: 2 }, { one: 1, two: 3 })         // { two: "2 --> 3" }
 * compare({ one: 1, two: 2 }, { one: 1, three: 3 })       // { two: "2 --> undefined", three: "undefined --> 3" }
 * compare(                                                // { obj: { one: 'one --> one-altered' } }
 *   { obj: { zero: "zero", one: "one" } },
 *   { obj: { zero: "zero", one: "one-altered" } }
 * )
 */
export function compare<T>(first: MaybeRef<T>, second: MaybeRef<T>, changesOnly = true): any {
  const before = unref(first)
  const after = unref(second)

  if ((!before || typeof before !== "object") && (!after || typeof after !== "object"))
    return comparePrimitives(before as MaybeRef<Primitive>, after as MaybeRef<Primitive>, changesOnly)

  if (Array.isArray(before) || Array.isArray(after))
    return compareArrays((before ?? []) as any[], (after ?? []) as any[], changesOnly)

  return compareObjects(before as MaybeRef<Record<string, any>>, after as MaybeRef<Record<string, any>>, changesOnly)
}

function flattenComparison(obj: any, parentKey: string = "", result: any = {}): any {
  for (const key in obj) {
    const isArray = !Number.isNaN(Number(key))
    if (Object.hasOwn(obj, key)) {
      const styledKey = isArray ? `[${key}]` : `${parentKey ? "." : ""}${key}`
      const newKey = parentKey ? `${parentKey}${styledKey}` : styledKey

      if (typeof obj[key] === "object" && obj[key] !== null) {
        flattenComparison(obj[key], newKey, result)
      }
      else {
        result[newKey] = obj[key]
      }
    }
  }
  return result
}

/**
 * Compare flat
 * @description Compare two items and get the differences as a flattened version of the output.
 * @param first The object to compare against.
 * @param second Object is compared with firstObject.
 *
 * @returns If the items are primitives, it'll return them, otherwise it'll return an object where each key, even nested keys are compounded at the top level
 *
 * @example
 * compareFlat(1, 1)  // undefined
 * compareFlat(1, 2)  // "1 --> 2"
 *
 * compareFlat(["zero", "one"], ["zero", "one"])                            // undefined
 * compareFlat(["zero", "one"], ["zero", "two"])                            // { 1: "one --> two" }
 * compareFlat({ arr: ["zero", "one"] }, { arr: ["zero", "one-altered"] })  // { 'arr[1]': 'one --> one-altered' }
 *
 * compareFlat({ one: 1, two: 2 }, { one: 1, two: 2 })    // undefined
 * compareFlat({ one: 1, two: 2 }, { one: 1, two: 3 })    // { two: "2 --> 3" }
 * compareFlat({ one: 1, two: 2 }, { one: 1, three: 3 })  // { two: "2 --> undefined", three: "undefined --> 3" }
 * compareFlat(                                           // { 'obj.one': 'one --> one-altered' }
 *   { obj: { zero: "zero", one: "one" } },
 *   { obj: { zero: "zero", one: "one-altered" } }
 * )
 */
export function compareFlat<T>(first: MaybeRef<T>, second: MaybeRef<T>): any {
  const comparison = compare(first, second)
  if (!comparison || typeof comparison === "string" || typeof comparison === "number" || typeof comparison === "boolean") {
    return comparison
  }

  return flattenComparison(comparison) ?? "No changes found"
}

interface PlainObject { [key: string]: any }

interface CollapseResult {
  result: any
  chain: ChainPart[] | null
}

interface ChainPart {
  key: string
  isNumeric: boolean
}

function isNumeric(key: string): boolean {
  return /^\d+$/.test(key)
}

function joinChain(chain: ChainPart[]): string {
  if (!chain[0])
    return ""
  // Start with the first part:
  let result = chain[0].isNumeric ? `[${chain[0].key}]` : chain[0].key
  for (let i = 1; i < chain.length; i++) {
    if(!chain[i]) {
      continue
    }
    result += chain[i]!.isNumeric ? `[${chain[i]!.key}]` : `.${chain[i]!.key}`
  }
  return result
}

function collapseHelper(input: any): CollapseResult {
  // Base case: if it's not an object (or is null), return as is.
  if (typeof input !== "object" || input === null) {
    return { result: input, chain: null }
  }

  const keys = Object.keys(input)
  if (keys.length === 1) {
    // Only one key: we can collapse.
    const [key] = keys
    if (key === undefined) {
      throw new Error("Undefined key found in object")
    }
    const chainPart: ChainPart = { key, isNumeric: isNumeric(key) }
    const child = collapseHelper(input[key])
    const newChain = child.chain ? [chainPart, ...child.chain] : [chainPart]
    return { result: child.result, chain: newChain }
  }
  else {
    // Multiple keys: process each property separately.
    const newObj: PlainObject = {}
    for (const key of keys) {
      const child = collapseHelper(input[key])
      if (child.chain !== null) {
        // Instead of merging with the current key (since it's a multi-key object),
        // we wrap the collapsed chain as the key of the value.
        newObj[key] = { [joinChain(child.chain)]: child.result }
      }
      else {
        newObj[key] = child.result
      }
    }
    return { result: newObj, chain: null }
  }
}

function collapseNestedObject(input: PlainObject): PlainObject {
  const { result, chain } = collapseHelper(input)
  // If the entire object was collapsible into a single chain, wrap it.
  return chain !== null ? { [joinChain(chain)]: result } : result
}

/**
 * Compare collapsed
 * @description Compare two items and get the differences as a collapsed version of the output.
 * @param first The object to compare against.
 * @param second Object is compared with first object.
 * @param returnFalse If there are no changes, return false instead of the user-friendly message
 *
 * @returns If the items are primitives, it'll return them, otherwise it'll return an object where each key, even nested keys are compounded at the top level
 *
 * @example
 * compareCollapsed(1, 1)  // undefined
 * compareCollapsed(1, 2)  // "1 --> 2"
 *
 * compareCollapsed(["zero", "one"], ["zero", "one"])                            // undefined
 * compareCollapsed(["zero", "one"], ["zero", "two"])                            // { 1: "one --> two" }
 * compareCollapsed({ arr: ["zero", "one"] }, { arr: ["zero", "one-altered"] })  // { 'arr[1]': 'one --> one-altered' }
 *
 * compareCollapsed({ one: 1, two: 2 }, { one: 1, two: 2 })    // undefined
 * compareCollapsed({ one: 1, two: 2 }, { one: 1, two: 3 })    // { two: "2 --> 3" }
 * compareCollapsed({ one: 1, two: 2 }, { one: 1, three: 3 })  // { two: "2 --> undefined", three: "undefined --> 3" }
 * compareCollapsed(                                           // { 'obj.one': 'one --> one-altered' }
 *   { obj: { zero: "zero", one: "one" } },
 *   { obj: { zero: "zero", one: "one-altered" } }
 * )
 *
 * compareCollapsed(                   // {
 *   {                                 //   'zeroZero.oneZero': {
 *     zeroZero: {                     //     twoZero: 'hello --> goodbye',
 *       oneZero: {                    //     twoTwo: {
 *         twoZero: "hello",           //       'threeZero.fourZero': 'This is a --> This was a'
 *         twoOne: "world",            //     }
 *         twoTwo: {                   //   }
 *           threeZero: {              // }
 *             fourZero: "This is a",
 *             fourOne: "triumph",
 *     }}}}},
 *   {
 *     zeroZero: {
 *       oneZero: {
 *         twoZero: "goodbye",
 *         twoOne: "world",
 *         twoTwo: {
 *           threeZero: {
 *             fourZero: "This was a",
 *             fourOne: "triumph",
 *   }}}}}
 * )
 */
export function compareCollapsed<T>(first: MaybeRef<T>, second: MaybeRef<T>, returnFalse = false): any {
  return collapseNestedObject(compare(first, second) ?? (returnFalse ? false : "No changes found"))
}