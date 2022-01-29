import dotenv from 'dotenv'
import { LinearClient } from 'bybit-api'
import { KLine } from './api'
import { sub, getUnixTime, toDate, secondsToMilliseconds, formatISO } from 'date-fns'
import { getRSI } from './technicalIndex'
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

  const rsiList = getRSI(kline.map(line => line.close), 14)
  const HIGH_RSI_BORDER = 70
  const LOW_RSI_BORDER = 30

  const prevTime = formatISO(secondsToDate(kline[kline.length - rsiList.length + rsiList.length - 2].open_time))
  const curTime = formatISO(secondsToDate(kline[kline.length - rsiList.length + rsiList.length - 1].open_time))
  const prevRSI = rsiList[rsiList.length - 2]
  console.log({ prev: { time: prevTime, rsi: prevRSI } })
  const currentRSI = rsiList[rsiList.length - 1]
  console.log({ current: { time: curTime, rsi: currentRSI } })
  if (prevRSI > HIGH_RSI_BORDER && currentRSI <= HIGH_RSI_BORDER) {
    console.log('RSIが下がっています')
  }
  if (prevRSI < LOW_RSI_BORDER && currentRSI >= LOW_RSI_BORDER) {
    console.log('RSIが上がっています')
  }
}

const secondsToDate = (seconds: number) => {
  return toDate(secondsToMilliseconds(seconds))
}

cron.schedule('* * * * *', () => {
  console.log(`start: ${formatISO(new Date())}`)
  main()
    .catch(err => console.error(err))
    .finally(() => console.info('end'))
})
