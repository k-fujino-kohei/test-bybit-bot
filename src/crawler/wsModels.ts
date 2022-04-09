import { Side } from '@/domains/models'

const topics = ['liquidation.BTCUSDT', 'instrument_info.100ms.BTCUSDT', 'trade.BTCUSDT'] as const
export type Topic = typeof topics[number]

interface WSResponse {
  topic: Topic
}
export const isWSResponse = (data: unknown): data is WSResponse =>
  (data instanceof Object && 'topic' in data)

type WSType = 'snapshot' | 'delta'

export interface InstrumentInfoResponse extends WSResponse {
  type: WSType
  data: { update: {
    openInterestE8?: string
    updatedAt: string
  }[] }
  // ミリ秒
  timestampE6: string
}

export interface TradeResponse extends WSResponse {
  data: {
    price: string
    size: number
    tickDirection: string
    timestamp: string
    tradeTimeMs: string
    side: Side
    tradeId: string
  }[]
}

export interface LiquidationResponse extends WSResponse {
  data: {
    symbol: string
    side: Side
    price: string
    qty: string
    time: number
  }
}

export const isInstrumentInfo = (data: WSResponse): data is InstrumentInfoResponse => data.topic === 'instrument_info.100ms.BTCUSDT'
export const isTradeResponse = (data: WSResponse): data is TradeResponse => data.topic === 'trade.BTCUSDT'
export const isLiquidationResponse = (data: WSResponse): data is LiquidationResponse => data.topic === 'liquidation.BTCUSDT'
