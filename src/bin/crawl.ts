import { Crawler } from '@/crawler/crawler'
import RingBuffer from 'ringbufferjs'
import cron from 'node-cron'
import { formatISO, formatISO9075 } from 'date-fns'
import { BufferQueues, Liquidation, OIInfo, Trade } from '@/crawler/queue'
import { config, Env } from '@/config'
import { DataStore } from '@/crawler/db'
import { LiquidationSchema, OISchema, TradeSchema, Values } from '@/crawler/schema'

const crawl = (env: Env, ongetData: (data: { oi: OIInfo[], trade: Trade[], liquidation: Liquidation[] }) => Promise<void>) => {
  const queue: BufferQueues = {
    oi: new RingBuffer<OIInfo>(100),
    trade: new RingBuffer<Trade>(300),
    liquidation: new RingBuffer<Liquidation>(50)
  }
  const crawler = new Crawler({ apiKey: env.API_KEY!, secret: env.API_SECRET, livenet: true }, queue)
  crawler.crawl()

  const eachSeconds = 5
  cron.schedule(`*/${eachSeconds} * * * * *`, () => {
    console.log(`will save at ${formatISO9075(new Date())}`)
    const oi = queue.oi.deqN(queue.oi.size())
    const trade = queue.trade.deqN(queue.trade.size())
    const liquidation = queue.liquidation.deqN(queue.liquidation.size())
    ongetData({ oi, trade, liquidation })
      .then()
      .catch((err) => console.error(err))
  })
}

const main = () => {
  const { env } = config()

  const db = new DataStore(env.DB_URL, env.DB_KEY)

  crawl(env, async (data) => {
    const oiValues: Values<OISchema> = data.oi.map(d => {
      return {
        value: d.oi,
        timestamp: formatISO(d.timestamp)
      }
    })
    await db.insert<OISchema>('oi', oiValues)

    const tradeValues: Values<TradeSchema> = data.trade.map(d => {
      return {
        side: d.side,
        price: d.price,
        size: d.size,
        timestamp: formatISO(d.timestamp)
      }
    })
    await db.insert<TradeSchema>('trade', tradeValues)

    const liqValues: Values<LiquidationSchema> = data.liquidation.map(d => {
      return {
        side: d.side,
        price: d.price,
        qty: d.qty,
        timestamp: formatISO(d.timestamp)
      }
    })
    await db.insert<LiquidationSchema>('liquidation', liqValues)
  })
}

main()
