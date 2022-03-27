import { Side, SymbolName } from '@/domains/models'
import { AccountDataRepository, Position } from '@/domains/repository/accountData'

import { ApiInstance } from '@/infrastructure/api/index'

export class AccountDataAPI implements AccountDataRepository {
  // eslint-disable-next-line no-useless-constructor
  constructor (private readonly api: ApiInstance, private readonly symbol: SymbolName) {}

  async getPositionList (): Promise<Position[]> {
    const resp = await this.api.private.linear.position.list.$get({ query: { symbol: this.symbol } })
    return resp.result
  }

  async placeActiveOrder (params: { side: string; orderType: string; qty: number; price?: number | undefined; timeInForce: string; closeOnTrigger: boolean; reduceOnly: boolean; orderLinkId?: string | undefined; takeProfit?: number | undefined; stopLoss?: number | undefined; tpTriggerBy?: string | undefined; slTriggerBy?: string | undefined; positionIdx?: number | undefined; }): Promise<void> {
    await this.api.private.linear.order.create.$post({ body: { ...params, symbol: this.symbol } })
  }

  async setTradingStop (params: { side: Side; }): Promise<void> {
    await this.api.private.linear.position.trading_stop.$post({ body: { symbol: this.symbol, side: params.side } })
  }
}
