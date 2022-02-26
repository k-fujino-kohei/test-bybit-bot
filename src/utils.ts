import { sub, getUnixTime, toDate, secondsToMilliseconds, Duration } from 'date-fns'

/**
 * From timestamp in seconds
 * @returns seconds
 */
export const timestampFrom = (ago: Duration, from: Date = new Date()): number => {
  return getUnixTime(sub(from, ago))
}

export const secondsToDate = (seconds: number): Date => {
  return toDate(secondsToMilliseconds(seconds))
}
