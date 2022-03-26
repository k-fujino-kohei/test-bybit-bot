import { KlineInterval, OpenInterestPeriod, SymbolName, Symbol } from '@/domains/models'
import { OpenInterest, MarketDataRepository, Kline } from '@/domains/repository/marketData'

import { ApiInstance } from '@/infrastructure/api/index'

export class MarketDataAPI implements MarketDataRepository {
  // eslint-disable-next-line no-useless-constructor
  constructor (private readonly api: ApiInstance, private readonly symbol: SymbolName) {}

  async getOpenInterest (params: { period: OpenInterestPeriod; limit?: number | undefined; }): Promise<OpenInterest[]> {
    const resp = await this.api.v2.public.open_interest.$get({
      query: {
        symbol: this.symbol,
        ...params
      }
    })
    return resp.result
  }

  async getKline (params: { interval: KlineInterval; from: number; limit?: number | undefined; }): Promise<Kline[]> {
    const resp = await this.api.public.linear.kline.$get({
      query: {
        symbol: this.symbol,
        ...params
      }
    })
    return resp.result
  }

  async getSymbols (): Promise<Symbol[]> {
    const resp = await this.api.v2.public.symbols.$get()
    return resp.result
  }
}
