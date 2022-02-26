import { Symbol } from '@/domains/repository/marketData'
import { BybitResponse } from '@/infrastructure/api/baseResponse'

export interface Methods {
  get: {
    resBody: BybitResponse<Symbol[]>
  }
}
