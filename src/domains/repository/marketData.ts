export type SymbolName = 'BTCUSDT'

// OpenInterest
export type OpenInterestPeriod = '5min' | '15min' | '30min' | '1h' | '4h' | '1d'

export interface OpenInterest {
  openInterest: number
  timestamp: number
  symbol: SymbolName
}

// Kline
export type KlineInterval = 1 | 3 | 5 | 15 | 30 | 60 | 120 | 240 | 360 | 720 | 'D' | 'M' | 'W'

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

// Symbols
export interface Symbol {
  name: SymbolName
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
