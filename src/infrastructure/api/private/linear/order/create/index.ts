export interface Methods {
  post: {
    reqBody: {
      side: string
      symbol: string
      orderType: string
      qty: number
      price?: number
      timeInForce: string
      closeOnTrigger: boolean
      reduceOnly: boolean
      orderLinkId?: string
      takeProfit?: number
      stopLoss?: number
      tpTriggerBy?: string
      slTriggerBy?: string
      positionIdx?: number
    }
  }
}
