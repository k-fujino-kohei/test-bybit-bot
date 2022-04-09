import { Crawler } from '@/crawler/crawler'
import RingBuffer from 'ringbufferjs'
import cron from 'node-cron'
import { formatISO9075 } from 'date-fns'
import { BufferQueues, Liquidation, OIInfo, Trade } from '@/crawler/queue'
import { config } from '@/config'

// クローラーのエントリーポイント

const crawl = () => {
  const { env } = config()
  const queue: BufferQueues = {
    oi: new RingBuffer<OIInfo>(100),
    trade: new RingBuffer<Trade>(300),
    liquidation: new RingBuffer<Liquidation>(50)
  }
  const crawler = new Crawler({ apiKey: env.API_KEY!, secret: env.API_SECRET, livenet: true }, queue)
  crawler.crawl()

  const eachSeconds = 5
  cron.schedule(`*/${eachSeconds} * * * * *`, () => {
    console.log(formatISO9075(new Date()))
    const oi = queue.oi.deqN(queue.oi.size())
    if (oi.length > 0) {
      // TODO: DBに保存する
      console.log(' >>>>> Open Interest >>>>>')
      oi.forEach((info) => {
        console.log(info)
      })
    }

    const trade = queue.trade.deqN(queue.trade.size())
    if (trade.length > 0) {
      // TODO: DBに保存する
      console.log(' >>>>> Trade >>>>>')
      trade.forEach((info) => {
        console.log(info)
      })
    }

    const liquidation = queue.liquidation.deqN(queue.liquidation.size())
    if (liquidation.length > 0) {
      // TODO: DBに保存する
      console.log(' >>>>> Liquidation >>>>>')
      liquidation.forEach((info) => {
        console.log(info)
      })
    }
  })
}

crawl()
