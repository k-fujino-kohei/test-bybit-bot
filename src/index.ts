import dotenv from 'dotenv'
import { LinearClient } from 'bybit-api'
import { KLine } from './api'
import { sub, getUnixTime, toDate, secondsToMilliseconds, formatISO } from 'date-fns'
import { getMACD, getRSI } from './technicalIndex'
import cron from 'node-cron'

const env = (() => {
  dotenv.config()
  const env = process.env
  return {
    API_KEY: env.API_KEY,
    API_SECRET: env.API_SECRET
  }
})()

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
  const kline: KLine[] = (await client.getKline({
    symbol: 'BTCUSDT',
    interval: '1',
    from: getUnixTime(sub(new Date(), { minutes: 200 }))
  })).result

  const rsi = latestRSI(kline, 14)
  const HIGH_RSI_BORDER = 70
  const LOW_RSI_BORDER = 30
  if (rsi.prev > HIGH_RSI_BORDER && rsi.cur <= HIGH_RSI_BORDER) {
    console.log('RSIが下がっています')
  }
  if (rsi.prev < LOW_RSI_BORDER && rsi.cur >= LOW_RSI_BORDER) {
    console.log('RSIが上がっています')
  }

  const macd = latestMACD(kline, { short: 12, long: 26, signal: 9 })
  if (macd.prev.histgram < 0 && macd.cur.histgram > 0) {
    console.log('ゴールデンクロス発生')
  }
  if (macd.prev.histgram > 0 && macd.cur.histgram < 0) {
    console.log('デッドクロス発生')
  }
}

const latestRSI = (kline: KLine[], interval: number): { prev: number, cur: number } => {
  const rsiList = getRSI(kline.map(line => line.close), interval)

  const time = (index: number) =>
    formatISO(toDate(secondsToMilliseconds(kline[kline.length - rsiList.length + rsiList.length + index].open_time)))

  const prevRSI = rsiList[rsiList.length - 2]
  const currentRSI = rsiList[rsiList.length - 1]

  console.log({ pre: { time: time(-2), rsi: prevRSI } })
  console.log({ cur: { time: time(-1), rsi: currentRSI } })

  return { prev: prevRSI, cur: currentRSI }
}

const latestMACD = (kline: KLine[], interval: { short: number, long: number, signal: number }) => {
  const macd = getMACD(kline.map(line => line.close), interval)

  const time = (index: number) =>
    formatISO(toDate(secondsToMilliseconds(kline[kline.length - macd.length + macd.length + index].open_time)))

  const prev = macd[macd.length - 2]
  const cur = macd[macd.length - 1]

  console.log({ pre: { time: time(-2), macd: prev } })
  console.log({ cur: { time: time(-1), macd: cur } })

  return { prev, cur }
}

cron.schedule('* * * * *', () => {
  console.log(`start: ${formatISO(new Date())}`)
  main()
    .catch(err => console.error(err))
    .finally(() => console.info('end'))
})
