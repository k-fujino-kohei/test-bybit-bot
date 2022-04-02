import { SimpleTrader } from './usecases/simpleTrader'
import dotenv from 'dotenv'
import { MarketDataAPI } from './infrastructure/repository/marketData'
import api from './infrastructure/api'
import { AccountDataAPI } from './infrastructure/repository/accountData'

const config = () => {
  const env = (() => {
    dotenv.config()
    const env = process.env
    return {
      API_KEY: env.API_KEY!,
      API_SECRET: env.API_SECRET!
    }
  })()
  return {
    env
  }
}

const _autoTrade = async () => {
  try {
    const { env } = config()
    const bybitClient = api({ key: env.API_KEY, secret: env.API_SECRET, useTestnet: true })
    const symbol = 'BTCUSDT'
    const marketRepository = new MarketDataAPI(bybitClient, symbol)
    const accountRepository = new AccountDataAPI(bybitClient, symbol)
    const trader = new SimpleTrader(marketRepository, accountRepository)
    await trader.trade()
  } catch (err) {
    console.error(err)
  }
}

exports.autoTrade = _autoTrade
