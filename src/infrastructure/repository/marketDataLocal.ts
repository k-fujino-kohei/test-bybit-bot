import { KlineInterval, OpenInterestPeriod, SymbolName, Symbol } from '@/domains/models'
import { OpenInterest, MarketDataRepository, Kline } from '@/domains/repository/marketData'

import fs from 'fs'
import path from 'path'
import * as csv from 'csv/sync'
import { secondsToDate } from '@/utils'
import { add, getUnixTime } from 'date-fns'

export interface CSVKline {
  time: string,
  open: number,
  low: number,
  high: number,
  close: number,
  volume: number
}

export interface CacheKline {
  file: string, data: CSVKline[]
}

export class MarketDataLocal implements MarketDataRepository {
  // eslint-disable-next-line no-useless-constructor
  constructor (private cacheKline: CacheKline[], private readonly csvDir: string, private readonly symbol: SymbolName, private currentDate: () => Date) {}

  async getOpenInterest (params: { period: OpenInterestPeriod; limit?: number | undefined; }): Promise<OpenInterest[]> {
    return Promise.reject(new Error('Not Implemented'))
  }

  async getKline (params: { interval: KlineInterval; from: number; limit?: number | undefined; }): Promise<Kline[]> {
    const fromDate = secondsToDate(params.from)

    const dateToFileName = (date: Date) => {
      const year = date.getUTCFullYear()
      // 月は０始まりで取得される
      const month = (date.getUTCMonth() + 1).toString().padStart(2, '0')
      const day = date.getUTCDate().toString().padStart(2, '0')
      const filename = `${this.symbol}${year}-${month}-${day}.csv`
      return filename
    }
    const readData = (date: Date) => {
      const filename = dateToFileName(date)
      const cache = this.cacheKline.find((f) => f.file === filename)
      if (cache) {
        return cache.data
      } else {
        console.log(`Read ${filename}`)
        try {
          const data = fs.readFileSync(path.resolve(this.csvDir, filename))
          const records = csv.parse(data, { columns: true }) as Array<CSVKline>
          this.cacheKline.push({ file: filename, data: records })
          return records
        } catch {
          this.cacheKline.push({ file: filename, data: [] })
          return []
        }
      }
    }

    // 取得する最大件数
    const limit = params.limit ?? 200

    const result: Kline[] = []

    let readDate = fromDate
    while (result.length < 200) {
      const records = readData(readDate)
      // １件も読み取れなかったら終わり
      if (records.length === 0) break
      for (const record of records) {
        const recordTime = getUnixTime(new Date(record.time))
        if (params.from <= recordTime) {
          result.push({
            symbol: this.symbol,
            period: '-1',
            startAt: Number(record.time),
            volume: Number(record.volume),
            open: Number(record.open),
            high: Number(record.high),
            low: Number(record.low),
            close: Number(record.close),
            interval: params.interval,
            openTime: recordTime,
            turnover: -1
          })
        }
        if (result.length >= limit) break
      }
      // limitに満たない場合は次の日付のデータを取得する
      readDate = add(fromDate, { days: 1 })
    }

    return result
  }

  async getSymbols (): Promise<Symbol[]> {
    return Promise.reject(new Error('Not Implemented'))
  }
}
