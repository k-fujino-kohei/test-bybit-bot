import { PositionIdx, Side, SymbolName, TpSlMode } from '../models'

export interface Position {
  userId: number
  symbol: SymbolName
  side: Side
  size: number
  positionValue: number
  entryPrice: number
  liqPrice: number
  bustPrice: number
  leverage: number
  autoAddMargin: number
  isIsolated: boolean
  positionMargin: number
  occClosingFee: number
  realisedPnl: number
  cumRealisedPnl: number
  freeQty: number
  tpSlMode: TpSlMode
  deleverageIndicator: number
  unrealisedPnl: number
  riskId: number
  takeProfit: string
  stopLoss: string
  trailingStop: string
  positionIdx: PositionIdx
}

export interface AccountDataRepository {
  getPositionList(params: {
    symbol?: SymbolName
  }): Promise<Position[]>
}
