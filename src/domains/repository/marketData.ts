import { KlineInterval, OpenInterestPeriod, SymbolName, Symbol } from '../models'

export interface OpenInterest {
  openInterest: number
  timestamp: number
  symbol: SymbolName
}

export interface Kline {
  symbol: SymbolName
  period: string
  startAt: number
  volume: number
  open: number
  high: number
  low: number
  close: number
  interval: number
  openTime: number
  turnover: number
}

export interface MarketDataRepository {
  getOpenInterest(params: {
    period: OpenInterestPeriod
    limit?: number
  }): Promise<OpenInterest[]>

  getKline(params: {
    interval: KlineInterval
    from: number
    limit?: number
  }): Promise<Kline[]>

  getSymbols(): Promise<Symbol[]>
}

// Liquidation
export interface Liquidation {
  id: number
  qty: number
  side: string
  time: number
  symbol: string
  price: number
}
