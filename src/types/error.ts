/**
 * # Feature
 * @description Represents a feature as one of several predefined string values.
 *
 * The `Feature` type is a union of string literals, allowing for explicit
 * typing and ensuring that only the specified values are valid.
 *
 * Possible values:
 * - 'client': Represents the client feature.
 * - 'project': Represents the project feature.
 * - 'work': Represents the work feature.
 *
 * This type can be used to ensure consistency across different parts of an application
 * when working with features.
 *
 */
export type Feature =
  | 'date'

/**
 * # ErrorType
 * @description Represents the types of errors that may occur in a system or application.
 *
 * The ErrorType type defines a set of allowed string literals that correspond
 * to specific categories of errors commonly encountered in system operations.
 *
 * Each error type represents a standardized error condition:
 * - 'not-found': Indicates that the requested resource could not be found.
 * - 'forbidden': Indicates that access to the requested resource is not allowed.
 * - 'unauthorized': Indicates that authentication is required or has failed.
 * - 'bad-request': Represents an error caused by an invalid request from the client.
 * - 'internal-server-error': Denotes a generic server-side error.
 *
 * ErrorType is useful in scenarios where applications need to identify, classify,
 * and handle errors consistently.
 */
export type ErrorType =
  | 'not-found'
  | 'forbidden'
  | 'unauthorized'
  | 'bad-request'
  | 'internal-server-error'

/**
 * # ErrorCode
 * @description Represents a compound error code type formatted as `${Feature}:${ErrorType}`.
 *
 * This type combines a specific `Feature` and an `ErrorType` into a single
 * string literal that can be used to identify and categorize various error cases
 * within an application.
 *
 * The `Feature` part indicates the system or module generating the error, while
 * the `ErrorType` part specifies the type or nature of the error occurring. Using
 * this format allows for structured and meaningful error code definitions.
 *
 * @example
 * `client:not-found`
 * `project:bad-request`
 * `work:internal-server-error`
 */
export type ErrorCode = `${Feature}:${ErrorType}`