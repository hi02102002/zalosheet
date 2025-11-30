/**
 * Available error codes for application errors
 */
export const ERROR_CODES = {
  NOT_FOUND: 'not_found',
  BLOCKED: 'blocked',
  UNKNOWN: 'unknown',
} as const

/**
 * Custom application error class with error codes
 * @extends Error
 */
export class AppError extends Error {
  /**
   * Creates an application error with a specific error code
   * @param message - Error message
   * @param code - Error code from ERROR_CODES
   */
  constructor(message: string, public code: keyof typeof ERROR_CODES) {
    super(message)
    this.name = 'AppError'
  }
}
