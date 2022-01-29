import dotenv from 'dotenv'
import { LinearClient } from 'bybit-api'
import { KLine } from './api'
import { sub, getUnixTime, toDate, secondsToMilliseconds, formatISO } from 'date-fns'
import { getBollingerBand, getMACD, getRSI } from './technicalIndex'
import cron from 'node-cron'

const env = (() => {
  dotenv.config()
  const env = process.env
  return {
    API_KEY: env.API_KEY,
    API_SECRET: env.API_SECRET
  }
})()

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

export async function main () {
  await f()
}

const f = async () => {
  const useLiveNet = false
  const client = new LinearClient(
    env.API_KEY,
    env.API_SECRET,
    useLiveNet
  )

  // 1分間隔でチャートを取得
  const SYMBOL = 'BTCUSDT'
  const kline: KLine[] = (await client.getKline({
    symbol: SYMBOL,
    interval: '1',
    from: getUnixTime(sub(new Date(), { minutes: 200 }))
  })).result

  const buyFlags = createFlags()
  const sellFlags = createFlags()

  const rsi = latestRSI(kline, 14)
  const macd = latestMACD(kline, { short: 12, long: 26, signal: 9 })
  const bb = latestBB(kline, 20, 2)

  const currentKline = rsi.cur.kline
  console.log({
    prev: {
      time: rsi.prev.time,
      close: rsi.prev.kline.close,
      rsi: rsi.prev.value,
      macd: macd.prev.value.signal,
      bb: { top: bb.prev.value.top, bottom: bb.prev.value.bottom }
    },
    cur: {
      time: rsi.cur.time,
      close: rsi.cur.kline.close,
      rsi: rsi.cur.value,
      macd: macd.cur.value.signal,
      bb: { top: bb.cur.value.top, bottom: bb.cur.value.bottom }
    }
  })

  const LOW_RSI_BORDER = 30
  const HIGH_RSI_BORDER = 70
  if (rsi.prev.value < LOW_RSI_BORDER && rsi.cur.value >= LOW_RSI_BORDER) {
    console.log('RSIが上がっています')
    buyFlags.rsi = true
  }
  if (rsi.prev.value > HIGH_RSI_BORDER && rsi.cur.value <= HIGH_RSI_BORDER) {
    console.log('RSIが下がっています')
    sellFlags.rsi = true
  }

  if (macd.prev.value.histgram < 0 && macd.cur.value.histgram > 0) {
    console.log('ゴールデンクロス発生')
    buyFlags.macd = true
  }
  if (macd.prev.value.histgram > 0 && macd.cur.value.histgram < 0) {
    console.log('デッドクロス発生')
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

  if (shouldBuy(buyFlags)) {
    console.log('>> 買い注文を出します')
    const result = await client.placeActiveOrder({
      side: 'Buy',
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
}

const latestRSI = (kline: KLine[], interval: number) =>
  getKlinePairs(kline, (kline) => getRSI(kline.map(line => line.close), interval))

const latestMACD = (kline: KLine[], interval: { short: number, long: number, signal: number }) =>
  getKlinePairs(kline, (kline) => getMACD(kline.map(line => line.close), interval))

const latestBB = (kline: KLine[], interval: number, multi: number) =>
  getKlinePairs(kline, (kline) => getBollingerBand(kline.map(v => v.close), interval, multi))

const getKlinePairs = <T>(kline: KLine[], getTechnicalIndex: (kline: KLine[]) => T[]) => {
  const ti = getTechnicalIndex(kline)

  const result = (index: number) => {
    const klineOf = (index: number) => kline[kline.length - ti.length + ti.length + index]
    const timeOf = (index: number) => toDate(secondsToMilliseconds(klineOf(index).open_time))
    return { time: timeOf(index), value: ti[ti.length + index], kline: klineOf(index) }
  }

  return {
    prev: result(-2),
    cur: result(-1)
  }
}

cron.schedule('* * * * *', () => {
  console.log(`start: ${formatISO(new Date())}`)
  main()
    .catch(err => console.error(err))
    .finally(() => console.info('end'))
})
