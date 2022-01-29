export type Interval = '1' | '3' | '5' | '15' | '30' | '60' | '120' | '240' | '360' | '720' | 'D' | 'M' | 'W'

export interface KLine {
  /** Symbol */
  symbol: string,
  /** Data refresh interval. Enum : 1 3 5 15 30 60 120 240 360 720 "D" "M" "W" */
  interval: Interval,
  /** Starting time */
  // eslint-disable-next-line camelcase
  open_time: number,
  /** Starting price */
  open: string,
  /** Maximum price */
  high: string,
  /** Minimum price */
  low: string,
  /** Closing price */
  close: number,
  /** Trading volume */
  volume: string,
  /** Transaction amount */
  turnover: string,
}
