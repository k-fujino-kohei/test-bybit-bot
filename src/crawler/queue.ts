import { Side } from '@/domains/models'
import RingBuffer from 'ringbufferjs'

export interface Trade {
  price: number
  size: number
  timestamp: number
  side: Side
  tradeId: string
}

export interface OIInfo {
  oi: number
  timestamp: number
}

export interface Liquidation {
  side: Side
  price: number
  qty: number
  timestamp: number
}

export interface BufferQueues {
  oi: RingBuffer<OIInfo>
  trade: RingBuffer<Trade>
  liquidation: RingBuffer<Liquidation>
}
