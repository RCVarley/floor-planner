/**
 * # ApiFeature
 * @description Represents a feature as one of several predefined string values.
 *
 * The `ApiFeature` type is a union of string literals, allowing for explicit
 * typing and ensuring that only the specified values are valid.
 *
 * Possible values:
 * - 'client': Represents the client feature.
 * - 'project': Represents the project feature.
 * - 'work': Represents the work feature.
 *
 * This type can be used to ensure consistency across different parts of an application
 * when working with features.
 */
export type ApiFeature =
  | 'date'

/**
 * # ApiAction
 * @description Represents an action as one of several predefined string values.
 *
 * The `ApiAction` type describes the specific operation or request being processed.
 */
export type ApiAction =
  | 'get'
  | 'post'
  | 'put'
  | 'patch'
  | 'delete'

/**
 * # ApiErrorType
 * @description Represents the types of errors that may occur in a system or application.
 *
 * The `ApiErrorType` type defines a set of allowed string literals that correspond
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
export type ApiErrorType =
  | 'not-found'
  | 'forbidden'
  | 'unauthorized'
  | 'bad-request'
  | 'internal-server-error'

/**
 * # ApiErrorCode
 * @description Represents a compound error code type formatted as `${ApiFeature}:${ApiAction}:${ErrorType}`.
 *
 * The `ApiErrorCode` type combines a specific `ApiFeature`, `ApiAction` and an `ApiErrorType` into a single
 * string literal that can be used to identify and categorize various error cases
 * within an application.
 *
 * The `ApiFeature` part indicates the system or module generating the error, while
 * the `ApiAction` part describes the specific operation or request being processed, and
 * the `ApiErrorType` part specifies the type or nature of the error occurring. Using
 * this format allows for structured and meaningful error code definitions.
 *
 * @example
 * `client:get:not-found`
 * `project:put:bad-request`
 * `work:patch:internal-server-error`
 */
export type ApiErrorCode = `${ApiFeature}:${ApiAction}:${ApiErrorType}`

/**
 * # Feature
 * @description Represents a feature as one of several predefined string values.
 *
 * The `Feature` type is a union of string literals, allowing for explicit
 * typing and ensuring that only the specified values are valid.
 *
 * Possible values:
 * - 'shape': For when generating or interacting with geometric shapes.
 * - 'floor-plan': For when working with floor plans.
 * - 'building': For when dealing with buildings or complex structures.
 * - 'floor': For when dealing with floors or levels within a building.
 * - 'room': For when dealing with rooms or spaces within a building floor.
 * - 'fixture': For when dealing with fixtures or appliances within a building floor.
 *
 * This type can be used to ensure consistency across different parts of an application
 * when working with features.
 */
export type Feature =
  | 'preview'
  | 'tool'
  | 'rectangle'
  | 'entity'
  | 'shape'
  | 'floor-plan'
  | 'building'
  | 'floor'
  | 'room'
  | 'section'
  | 'fixture'

/**
 * # Action
 * @description Represents an action as one of several predefined string values.
 *
 * The `Action` type describes the specific operation or request being processed.
 */
export type Action =
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'list'
  | 'select'
  | 'move'

/**
 * # ApiErrorType
 * @description Represents the types of errors that may occur in a system or application.
 *
 * The ErrorType type defines a set of allowed string literals that correspond
 * to specific categories of errors commonly encountered in system operations.
 *
 * Each error type represents a standardized error condition:
 * - 'not-found': Indicates that the requested resource could not be found.
 * - 'bad-parameters': Represents an error caused by an invalid parameter passed to a function.
 *
 * ErrorType is useful in scenarios where applications need to identify, classify,
 * and handle errors consistently.
 */
export type ErrorType =
  | 'not-found'
  | 'bad-parameters'

/**
 * # ClientErrorCode
 * @description Represents a compound error code type formatted as `${Feature}:${Action}:${ErrorType}`.
 *
 * This type combines a specific `Feature`, `Action` and an `ErrorType` into a single
 * string literal that can be used to identify and categorize various error cases
 * within an application.
 *
 * The `Feature` part indicates the system or module generating the error, while
 * the `Action` part describes the specific operation or request being processed, and
 * the `ErrorType` part specifies the type or nature of the error occurring. Using
 * this format allows for structured and meaningful error code definitions.
 *
 * @example
 * `shape:create:missing-value`
 */
export type ClientErrorCode = `${Feature}:${Action}:${ErrorType}`

export type ErrorCode = ApiErrorCode | ClientErrorCode