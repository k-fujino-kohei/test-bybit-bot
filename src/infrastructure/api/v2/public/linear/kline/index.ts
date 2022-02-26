import { Kline, KlineInterval, SymbolName } from '@/domains/repository/marketData'
import { BybitResponse } from '@/infrastructure/api/baseResponse'

export interface Methods {
  get: {
    query: {
      symbol: SymbolName;
      interval: KlineInterval;
      from: number;
      limit?: number;
    }

    resBody: BybitResponse<Kline[]>
  }
}
