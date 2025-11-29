export const ERROR_CODES = {
  NOT_FOUND: 'not_found',
  BLOCKED: 'blocked',
  UNKNOWN: 'unknown',
} as const

export class AppError extends Error {
  constructor(message: string, public code: keyof typeof ERROR_CODES) {
    super(message)
    this.name = 'AppError'
  }
}
