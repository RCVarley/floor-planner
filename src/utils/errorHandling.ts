import type {ErrorCode} from "../types/error.ts"

/**
 * # NamedError
 * @description A custom error with a definable name
 */
export class NamedError<ErrorCodeType extends ErrorCode> extends Error {
  name: ErrorCodeType

  /**
   * Create an error with a custom name
   * @param name The name of the error
   * @param message The message of the error
   * @param options The options of the error
   */
  constructor(name: ErrorCodeType, message: string, options?: ErrorOptions) {
    super(message, options)
    this.name = name
  }
}

/**
 * # reportError(code)
 * @description A standard error reporting function that can be updated to use 3rd party error tracking services like Sentry, Bugsnag, etc.
 * @param code The error code to be reported
 */
export function reportError(code: ErrorCode) {
  console.error(code)
}

/**
 * # handleError(code, message)
 * @description A standard error handling function that returns a Result object with the error code and message.
 * @param code The error code to be handled
 * @param message The error message to be included in the result
 * @param cause The optional cause of the error
 * @returns A Result object with the error code and message
 */
export function handleError(code: ErrorCode, message: string, cause?: unknown ): Failure<Error> {
  return {
    data: null,
    error: new NamedError(code, message, { cause }),
  }
}

/**
 * # Success<T>
 * @template T The type of the data
 * @description Represents a successful result with data of type T
 */
type Success<T> = {
  data: T
  error: null
}

/**
 * # Failure<E>
 * @template E The type of the error
 * @description Represents a failed result with error of type E
 */
type Failure<E> = {
  data: null
  error: E
}

/**
 * # Result<T, E>
 * A union type that encapsulates a successful result or an error.
 *
 * @template T The type of the successful result.
 * @template E The type of the error. Defaults to the built-in `Error` type.
 *
 * A `Result` object is either:
 * - `Success<T>`: Indicates the operation succeeded and holds the success value of type `T`.
 * - `Failure<E>`: Indicates the operation failed and holds an error value of type `E`.
 */
export type Result<T, E = Error> = Success<T> | Failure<E>

/**
 * # tryCatch(promise)
 * @template T The type of the successful result.
 * @template E The type of the error. Defaults to the built-in `Error` type.
 * @param promise The promise to be executed.
 * @returns A promise that resolves to a `Result` object.
 */
export async function tryCatch<T, E = Error>(promise: Promise<T>): Promise<Result<T, E>> {
  let result: Result<T, E>
  try {
    const data = await promise
    result = { data, error: null }
  }
  catch (error) {
    result = { data: null, error: error as E }
  }

  return result
}