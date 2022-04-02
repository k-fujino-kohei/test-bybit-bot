export type Side = 'Buy' | 'Sell'

/**
 * - Limit: 指値注文
 * - Merket: 成行注文
 */
export type OrderType = 'Limit' | 'Market'

/** https://help.bybit.com/hc/en-us/articles/360039749233-What-Are-Time-In-Force-TIF-GTC-IOC-FOK- */
export type TimeInForce =
  'GoodTillCancel'
  | 'ImmediateOrCancel'
  | 'FillOrKill'
  | 'PostOnly'

/** https://bybit-exchange.github.io/docs/linear/#tp-sl-mode-tp_sl_mode */
export type TpSlMode = 'Full' | 'Partial'

export type TriggerBy = 'LastPrice' | 'IndexPrice' | 'MarkPrice'

/**
 * 0-One-Way Mode
 * 1-Buy side of both side mode
 * 2-Sell side of both side mode
 */
export type PositionIdx = 0 | 1 | 2

export type SymbolName = 'BTCUSDT'

// OpenInterest
export type OpenInterestPeriod = '5min' | '15min' | '30min' | '1h' | '4h' | '1d'

// Kline
export type KlineInterval = 1 | 3 | 5 | 15 | 30 | 60 | 120 | 240 | 360 | 720 | 'D' | 'M' | 'W'

// Symbols
export interface Symbol {
  name: SymbolName
}
