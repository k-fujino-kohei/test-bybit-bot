export type Symbol = 'BTCUSDT'

// OpenInterest
export interface OpenInterest {
  openInterest: number
  timestamp: number
  symbol: string
}

export type OpenInterestPeriod = '5min' | '15min' | '30min' | '1h' | '4h' | '1d'

export interface MarketDataRepository {
  getOpenInterest(params: {
    period: OpenInterestPeriod
    limit?: number
  }): Promise<OpenInterest>
}
