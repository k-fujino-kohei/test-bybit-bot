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

export const millSecondsToDate = (millSeconds: number): Date => {
  return toDate(millSeconds)
}

/**
 * 任意の桁で四捨五入する関数
 * @param {number} value 四捨五入する数値
 * @param {number} base どの桁で四捨五入するか
 * @return {number} 四捨五入した値
 */
export const orgRound = (value: number, base: number): number => {
  return Math.round(value * base) / base
}
