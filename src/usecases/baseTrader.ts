import { Side } from '@/domains/models'

type OrderType = 'new' | 'stop'

interface Order {
  type: OrderType
  side: Side
}

/** 新規注文 */
export interface NewOrder extends Order {
  type: 'new'
  price: number
  qty: number
}

/** 決済注文 */
export interface StopOrder extends Order {
  type: 'stop'
}

const isNewOrder = (order: Order): order is NewOrder => order.type === 'new'
const isStopOrder = (order: Order): order is StopOrder => order.type === 'stop'

export abstract class BaseTrader {
  async trade () {
    const order = await this.strategy()
    if (order === null) {
      /** nop */
    } else if (isNewOrder(order)) {
      await this.postNewOrder(order)
    } else if (isStopOrder(order)) {
      await this.postStopOrder(order)
    }
  }

  /** 新規注文を出す */
  abstract postNewOrder (order: NewOrder): Promise<void>

  /** ポジションを解消する */
  abstract postStopOrder (order: StopOrder): Promise<void>

  /** 新規注文を出すかポジションを解消するかを決定する */
  abstract strategy (): Promise<NewOrder | StopOrder | null>
}
