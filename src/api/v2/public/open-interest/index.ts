import { BybitResponse, Symbol } from '@/api/types'

type OpenInterestPeriod = '5min' | '15min' | '30min' | '1h' | '4h' | '1d'

interface OpenInterest {
  openInterest: number
  timestamp: number
  symbol: string
}

export interface Methods {
  get: {
    query?: {
      symbol: Symbol
      period: OpenInterestPeriod
      limit?: number
    }

    resBody: BybitResponse<OpenInterest>
  }
}
