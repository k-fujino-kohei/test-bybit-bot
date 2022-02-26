import { BybitResponse } from '@/infrastructure/api/baseResponse'
import { OpenInterest, OpenInterestPeriod, Symbol } from '@/domains/repository/marketData'

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
