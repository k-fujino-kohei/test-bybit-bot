import { LinearClient } from 'bybit-api'
import { sub, getUnixTime, toDate, secondsToMilliseconds } from 'date-fns'
import { getBollingerBand, getMACD, getRSI } from '@/domains/technicalIndex'
import { KLine } from '@/api'

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

export async function trade (env: { apiKey: string, apiSecret: string, useLiveNet: boolean }) {
  const client = new LinearClient(
    env.apiKey,
    env.apiSecret,
    env.useLiveNet
  )

  // 1分間隔でチャートを取得
  const SYMBOL = 'BTCUSDT'
  const resp = await client.getKline({
    symbol: SYMBOL,
    interval: '1',
    from: getUnixTime(sub(new Date(), { minutes: 200 }))
  })
  const kline: KLine[] = resp.result

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
    const result = await client.placeActiveOrder({
      side: 'Sell',
      symbol: SYMBOL,
      order_type: 'Limit',
      qty: 0.01,
      price: currentKline.close,
      time_in_force: 'GoodTillCancel',
      reduce_only: false,
      close_on_trigger: false
    })
    console.log(result)
  }

  if (shouldBuy(buyFlags)) {
    console.log('>> 売り注文を決済します')
    client.setTradingStop({
      symbol: SYMBOL,
      side: 'Sell'
    })
  }
}

const latestRSI = (kline: KLine[], interval: number, prev?: number) =>
  getKlinePairs(kline, (kline) => getRSI(kline.map(line => line.close), interval), prev)

const latestMACD = (kline: KLine[], interval: { short: number, long: number, signal: number }, prev?: number) =>
  getKlinePairs(kline, (kline) => getMACD(kline.map(line => line.close), interval), prev)

const latestBB = (kline: KLine[], interval: number, options: { multi: number }, prev?: number) =>
  getKlinePairs(kline, (kline) => getBollingerBand(kline.map(v => v.close), interval, options.multi), prev)

const getKlinePairs = <T>(kline: KLine[], getTechnicalIndex: (kline: KLine[]) => T[], prev?: number) => {
  const ti = getTechnicalIndex(kline)

  const result = (index: number) => {
    const klineOf = (index: number) => kline[kline.length - ti.length + ti.length + index]
    const timeOf = (index: number) => toDate(secondsToMilliseconds(klineOf(index).open_time))
    return { time: timeOf(index), value: ti[ti.length + index], kline: klineOf(index) }
  }

  return {
    prev: result(-1 - (prev ?? 1)),
    cur: result(-1)
  }
}
