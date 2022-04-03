import { Side, SymbolName } from '@/domains/models'
import { AccountDataRepository, Position } from '@/domains/repository/accountData'
import { formatISO } from 'date-fns'

export interface LocalAccountDataStore {
  positionList: Partial<Position>[]
  tradeHistory: {
    time: Date,
    side: Side,
    qty: number,
    price?: number,
    profitAndLoss: number,
    total: number,
  }[]
  latestTotal: number
}

export class AccountDataLocal implements AccountDataRepository {
  // eslint-disable-next-line no-useless-constructor
  constructor (private dataStore: LocalAccountDataStore, private readonly symbol: SymbolName, private currentDate: () => Date) {}

  async getPositionList (): Promise<Position[]> {
    return this.dataStore.positionList
  }

  async placeActiveOrder (params: {
      side: string;
      orderType: string;
      qty: number;
      price?: number | undefined;
      timeInForce: string;
      closeOnTrigger: boolean;
      reduceOnly: boolean;
      orderLinkId?: string | undefined;
      takeProfit?: number | undefined;
      stopLoss?: number | undefined;
      tpTriggerBy?: string | undefined;
      slTriggerBy?: string | undefined;
      positionIdx?: number | undefined;
  }): Promise<void> {
    let side = params.side
    let profitAndLoss: number = 0
    if (params.reduceOnly) {
      const positionIdx = this.dataStore.positionList.findIndex((p) => p.side === params.side)
      const position = this.dataStore.positionList[positionIdx]
      // 損益を算出
      profitAndLoss = position.freeQty * params.price

      // ポジションから削除する
      this.dataStore.positionList.splice(positionIdx, 1)
      side = side === 'Sell' ? 'Buy' : side
    } else {
      profitAndLoss = -(params.qty * params.price)
      // ポジションに積む
      const position = this.dataStore.positionList.find((p) => p.side === params.side)
      if (position && position.freeQty !== undefined) {
        position.freeQty += params.qty
      } else {
        this.dataStore.positionList.push({
          symbol: this.symbol,
          side: params.side,
          freeQty: params.qty
        })
      }
    }

    this.dataStore.latestTotal += profitAndLoss

    // 履歴を残す
    this.dataStore.tradeHistory.push({
      time: formatISO(this.currentDate()),
      side,
      qty: params.qty,
      price: params.price,
      profitAndLoss,
      total: this.dataStore.latestTotal
    })
  }

  async setTradingStop (params: { side: Side; }): Promise<void> {
    return Promise.reject(new Error('Not Implemented'))
  }
}
