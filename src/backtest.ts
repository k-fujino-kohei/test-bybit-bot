import * as dfd from 'danfojs'
import { SimpleTrader } from './usecases/simpleTrader'
import { CacheKline, MarketDataLocal } from './infrastructure/repository/marketDataLocal'
import { AccountDataLocal, LocalAccountDataStore } from './infrastructure/repository/accountDataLocal'
import { addMinutes, isAfter, add, Duration, format } from 'date-fns'

interface DateParams {
  year: number, month: number, date: number, hour?: number, minutes?: number
}
const period = (
  from: DateParams,
  duration: Duration
) => {
  // 月は0始まりなので-1する
  const fromDate = add(
    new Date(from.year, from.month - 1, from.date, from.hour ?? 0, from.minutes ?? 0),
    // UTCに変換する
    { hours: 9 }
  )
  const toDate = add(fromDate, duration)
  return { fromDate, toDate }
}

const run = async (trader: {
  fromDate: DateParams,
  duration: Duration,
  nextDate: (fromDate: Date, passed: number) => Date,
  trade: (currentDate: Date) => Promise<void>,
  finished: (fromDate: Date, toDate: Date, passed: number) => void
}) => {
  const { fromDate, toDate } = period(trader.fromDate, trader.duration)
  console.log(`${fromDate} ~ ${toDate}`)

  let passed = 0
  try {
    while (true) {
      const currentDate = trader.nextDate(fromDate, passed)
      if (isAfter(currentDate, toDate)) break
      await trader.trade(currentDate)
      passed += 1
    }
  } catch (err) {
    console.error(err)
  } finally {
    trader.finished(fromDate, toDate, passed)
  }
}

const runSimpleTrader = async () => {
  const symbol = 'BTCUSDT'
  const localDataStore: LocalAccountDataStore = {
    positionList: [],
    tradeHistory: [],
    latestTotal: 0
  }
  const cacheKline: CacheKline[] = []

  await run({
    fromDate: { year: 2022, month: 3, date: 1, hour: 9 },
    duration: { days: 7 },
    nextDate: addMinutes,
    trade: async (currentDate: Date) => {
      const accountRepository = new AccountDataLocal(localDataStore, symbol, () => currentDate)
      const marketRepository = new MarketDataLocal(cacheKline, './backtest_data', symbol, () => currentDate)
      const trader = new SimpleTrader(marketRepository, accountRepository, () => currentDate)
      await trader.trade()
    },
    finished: (fromDate: Date, toDate: Date) => {
      // CSVにして結果を保存
      const df = new dfd.DataFrame(localDataStore.tradeHistory)
      df.print()
      const from = format(fromDate, 'yyyy-MM-dd')
      const to = format(toDate, 'yyyy-MM-dd')
      const savedFilePath = `./backtest_tradehistory_${from}_${to}.csv`
      df.toCSV({ filePath: savedFilePath })
      console.log(`saved the tradehistory at: ${savedFilePath}`)
    }
  })
}

runSimpleTrader().then().catch((err) => console.error(err))
