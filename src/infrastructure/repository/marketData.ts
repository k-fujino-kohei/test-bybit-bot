import { OpenInterest, MarketDataRepository, Symbol, OpenInterestPeriod } from '@/domains/repository/marketData'
import { ApiInstance } from '@/infrastructure/api/index'

export class MarketDataAPI implements MarketDataRepository {
  // eslint-disable-next-line no-useless-constructor
  constructor (private readonly api: ApiInstance, private readonly symbol: Symbol) {}

  async getOpenInterest (params: { period: OpenInterestPeriod; limit?: number | undefined; }): Promise<OpenInterest> {
    const resp = await this.api.v2.public.open_interest.$get({
      query: {
        symbol: this.symbol,
        ...params
      }
    })
    return resp.result
  }
}
