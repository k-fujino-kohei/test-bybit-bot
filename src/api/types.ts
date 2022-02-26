export type Symbol = 'BTCUSDT'

export interface BybitResponse<T> {
  retCode: number
  retMsg: string
  extCode: string
  extInfo: string
  result: T
  timeNow: number
}
