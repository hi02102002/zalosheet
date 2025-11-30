/**
 * Delays execution for a specified amount of time
 * @param ms - Number of milliseconds to sleep
 * @returns Promise that resolves after the specified delay
 * @example
 * await sleep(1000) // Sleep for 1 second
 */
export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
