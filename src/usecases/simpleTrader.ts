import { sub, getUnixTime, toDate, secondsToMilliseconds } from 'date-fns'
import { getBollingerBand, getMACD, getRSI } from '@/domains/technicalIndex'
import { KLine } from '@/api'
import { PartiallyPartial } from '@/utils'
import { BaseTrader, NewOrder, StopOrder } from './baseTrader'
import { MarketDataRepository } from '@/domains/repository/marketData'
import { AccountDataRepository } from '@/domains/repository/accountData'

export class SimpleTrader extends BaseTrader {
  constructor (
    private marketRepository: MarketDataRepository,
    private accountRepository: AccountDataRepository
  ) {
    super()
  }

  async postNewOrder (order: NewOrder) {
    console.log('新規注文を出す')
    await this.accountRepository.placeActiveOrder({
      side: order.side,
      orderType: 'Limit',
      qty: order.qty,
      price: order.price,
      timeInForce: 'GoodTillCancel',
      reduceOnly: false,
      closeOnTrigger: false
    })
  }

  async postStopOrder (order: StopOrder) {
    console.log('ポジションを解消する')
    this.accountRepository.setTradingStop({ side: order.side })
  }

  async strategy (): Promise<NewOrder | StopOrder | null> {
    const kline = await this.marketRepository.getKline({
      interval: 1,
      from: getUnixTime(sub(new Date(), { minutes: 200 }))
    })

    const buyFlags = createFlags()
    const sellFlags = createFlags()

    const rsi = latestRSI(kline, 14, 2)
    const macd = latestMACD(kline, { short: 12, long: 26, signal: 9 }, 2)
    const bb = latestBB(kline, 20, { multi: 2 })

    const currentKline = rsi.cur.kline

    const LOW_RSI_BORDER = 30
    const HIGH_RSI_BORDER = 70
    if (rsi.prev.value < LOW_RSI_BORDER && rsi.cur.value >= LOW_RSI_BORDER) {
      console.log('↑RSIが上がっています')
      buyFlags.rsi = true
    }
    if (rsi.prev.value > HIGH_RSI_BORDER && rsi.cur.value <= HIGH_RSI_BORDER) {
      console.log('↓RSIが下がっています')
      sellFlags.rsi = true
    }

    if (macd.prev.value.histgram < 0 && macd.cur.value.histgram > 0) {
      console.log('↑ゴールデンクロス発生')
      buyFlags.macd = true
    }
    if (macd.prev.value.histgram > 0 && macd.cur.value.histgram < 0) {
      console.log('↓デッドクロス発生')
      sellFlags.macd = true
    }

    if (bb.cur.value.bottom > bb.cur.kline.close) {
      console.log('下部BBを下回っています')
      buyFlags.bb = true
    }
    if (bb.cur.value.top < bb.cur.kline.close) {
      console.log('上部BBを上回っています')
      sellFlags.bb = true
    }

    // 逆張り
    if (shouldSell(sellFlags)) {
      console.log('<< 売り注文を出します')
      return {
        type: 'new',
        side: 'Sell',
        price: currentKline.close * 1.01,
        qty: 0.01
      }
    }

    if (shouldBuy(buyFlags)) {
      console.log('>> 売り注文を決済します')
      return {
        type: 'stop',
        side: 'Sell'
      }
    }

    // 何もしない
    return null
  }
}

interface Flags {
  rsi: boolean,
  macd: boolean,
  bb: boolean
}

const createFlags = (): Flags => {
  return {
    rsi: false,
    macd: false,
    bb: false
  }
}

const shouldBuy = (flags: Flags): boolean => {
  const bit = Object.values(flags) as boolean[]
  return bit.filter(b => b).length >= 2
}

const shouldSell = (flags: Flags): boolean => {
  const bit = Object.values(flags) as boolean[]
  return bit.filter(b => b).length >= 2
}

type PriceAtTime = PartiallyPartial<Pick<KLine, 'close' | 'open_time'>, 'open_time'>

const latestRSI = (prices: PriceAtTime[], interval: number, prev?: number) =>
  getKlinePairs(prices, (price) => getRSI(price.map(line => line.close), interval), prev)

const latestMACD = (prices: PriceAtTime[], interval: { short: number, long: number, signal: number }, prev?: number) =>
  getKlinePairs(prices, (price) => getMACD(price.map(line => line.close), interval), prev)

const latestBB = (prices: PriceAtTime[], interval: number, options: { multi: number }, prev?: number) =>
  getKlinePairs(prices, (price) => getBollingerBand(price.map(v => v.close), interval, options.multi), prev)

const getKlinePairs = <T>(prices: PriceAtTime[], getTechnicalIndex: (prices: PriceAtTime[]) => T[], prev?: number) => {
  const ti = getTechnicalIndex(prices)

  const result = (index: number) => {
    const klineOf = (index: number) => prices[prices.length - ti.length + ti.length + index]
    const res = {
      value: ti[ti.length + index],
      kline: klineOf(index)
    }

    const openTime = klineOf(index).open_time
    if (openTime) {
      const time = toDate(secondsToMilliseconds(openTime))
      return { ...res, time }
    }
    return res
  }

  return {
    prev: result(-1 - (prev ?? 1)),
    cur: result(-1)
  }
}
