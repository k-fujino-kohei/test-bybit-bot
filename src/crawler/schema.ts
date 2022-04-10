export interface Schema {
  table: string
  values: { [field: string]: any }[]
}

export type Table<T> = T extends Schema ? Pick<T, 'table'>['table'] : null
export type Values<T> = T extends { values: { [field: string]: any }[] } ? Pick<T, 'values'>['values'] : null

export interface OISchema extends Schema {
  table: 'oi'
  values: {
    value: number
    timestamp: string
  }[]
}

export interface TradeSchema extends Schema {
  table: 'trade'
  values: {
    side: string
    price: number
    size: number
    timestamp: string
  }[]
}

export interface LiquidationSchema extends Schema {
  table: 'liquidation'
  values: {
    side: string
    price: number
    qty: number
    timestamp: string
  }[]
}
