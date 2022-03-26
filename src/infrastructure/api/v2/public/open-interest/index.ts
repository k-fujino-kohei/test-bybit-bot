import { BybitResponse } from '@/infrastructure/api/baseResponse'
import { OpenInterest, OpenInterestPeriod, SymbolName } from '@/domains/repository/marketData'

export interface Methods {
  get: {
    query?: {
      symbol: SymbolName
      period: OpenInterestPeriod
      limit?: number
    }

    resBody: BybitResponse<OpenInterest[]>
  }
}
