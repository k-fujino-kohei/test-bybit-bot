import { SimpleTrader } from './usecases/simpleTrader'
import { MarketDataAPI } from './infrastructure/repository/marketData'
import api from './infrastructure/api'
import { AccountDataAPI } from './infrastructure/repository/accountData'
import { config } from './config'

const _autoTrade = async () => {
  try {
    const { env } = config()
    const bybitClient = api({ key: env.API_KEY, secret: env.API_SECRET, useTestnet: true })
    const symbol = 'BTCUSDT'
    const marketRepository = new MarketDataAPI(bybitClient, symbol)
    const accountRepository = new AccountDataAPI(bybitClient, symbol)
    const trader = new SimpleTrader(marketRepository, accountRepository, () => new Date())
    await trader.trade()
  } catch (err) {
    console.error(err)
  }
}

exports.autoTrade = _autoTrade
