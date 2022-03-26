export type Side = 'Buy' | 'Sell'

export type OrderType = 'Limit' | 'Market'

export type TimeInForce =
  'GoodTillCancel'
  | 'ImmediateOrCancel'
  | 'FillOrKill'
  | 'PostOnly'
