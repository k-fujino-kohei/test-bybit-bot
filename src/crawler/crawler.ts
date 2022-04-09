import { orgRound } from '@/utils'
import { DefaultLogger, WebsocketClient, WSClientConfigurableOptions } from 'bybit-api'
import { toCamel } from 'snake-camel'
import { Liquidation, OIInfo, BufferQueues, Trade } from './queue'
import { InstrumentInfoResponse, isInstrumentInfo, isLiquidationResponse, isTradeResponse, isWSResponse, LiquidationResponse, Topic, TradeResponse } from './wsModels'

export class Crawler {
  private readonly ws: WebsocketClient
  private readonly topics: Topic[]

  constructor (config: { apiKey: string, secret: string, livenet: boolean }, private readonly queue: BufferQueues) {
    const wsConfig: WSClientConfigurableOptions = {
      key: config.apiKey,
      secret: config.secret,
      livenet: config.livenet,
      market: 'linear'
    }
    DefaultLogger.silly = () => {}
    this.ws = new WebsocketClient(wsConfig, DefaultLogger)
    this.topics = ['instrument_info.100ms.BTCUSDT', 'liquidation.BTCUSDT', 'trade.BTCUSDT']
  }

  crawl (onError: (err: any) => void = (err) => console.error(err)) {
    this.ws.subscribe(this.topics)

    this.ws.on('update', d => {
      const data = toCamel(d)

      if (!isWSResponse(data)) {
        return
      }

      if (isTradeResponse(data)) {
        this.readTrade(data)
      }

      if (isLiquidationResponse(data)) {
        this.readLiquidation(data)
      }

      if (isInstrumentInfo(data)) {
        this.readInstrumentInfo(data)
      }
    })

    this.ws.on('error', err => {
      onError(err)
    })
  }

  private readLiquidation (data: LiquidationResponse) {
    const liquidation: Liquidation = {
      side: data.data.side,
      price: Number(data.data.price),
      qty: Number(data.data.qty),
      timestamp: data.data.time
    }
    this.queue.liquidation.enq(liquidation)
  }

  private readTrade (data: TradeResponse) {
    data.data.forEach((d) => {
      const trade: Trade = {
        price: Number(d.price),
        size: d.size,
        timestamp: Number(d.tradeTimeMs),
        side: d.side,
        tradeId: d.tradeId
      }
      this.queue.trade.enq(trade)
    })
  }

  private latestOIInfo: Partial<OIInfo> = {
    oi: undefined,
    timestamp: undefined
  }

  private readInstrumentInfo (data: InstrumentInfoResponse) {
    if (data.type !== 'delta') {
      return
    }
    if (!data.data.update) {
      return
    }
    if (data.data.update.length === 0) {
      return
    }
    const d = data.data.update[0]!
    if (!d.openInterestE8) {
      return
    }
    // 小数点1位で四捨五入して整数にする
    const oi = orgRound(Number(d.openInterestE8) / (10 ** 8), 1)
    // OIは常に得られるわけではなく変更がないこともあるので、変更されたときだけ取得する
    const isChangedOI = oi !== this.latestOIInfo.oi
    if (isChangedOI) {
      const oiinfo: OIInfo = {
        oi,
        timestamp: Number(data.timestampE6) / 1000
      }

      this.queue.oi.enq(oiinfo)
      this.latestOIInfo = oiinfo
    }
  }
}
