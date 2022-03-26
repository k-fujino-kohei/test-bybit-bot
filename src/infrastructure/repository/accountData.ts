import { SymbolName } from '@/domains/models'
import { AccountDataRepository, Position } from '@/domains/repository/accountData'

import { ApiInstance } from '@/infrastructure/api/index'

export class AccountDataAPI implements AccountDataRepository {
  // eslint-disable-next-line no-useless-constructor
  constructor (private readonly api: ApiInstance, private readonly symbol: SymbolName) {}

  async getPositionList (): Promise<Position[]> {
    const resp = await this.api.private.linear.position.list.$get({ query: { symbol: this.symbol } })
    return resp.result
  }
}
