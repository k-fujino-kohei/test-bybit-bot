import { BybitResponse } from '@/infrastructure/api/baseResponse'
import { OpenInterest } from '@/domains/repository/marketData'
import { OpenInterestPeriod, SymbolName } from '@/domains/models'

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
