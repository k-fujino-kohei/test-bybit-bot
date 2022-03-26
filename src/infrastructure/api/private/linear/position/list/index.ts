import { SymbolName } from '@/domains/models'
import { Position } from '@/domains/repository/accountData'
import { BybitResponse } from '@/infrastructure/api/baseResponse'

export interface Methods {
  get: {
    query: {
      symbol?: SymbolName
    }

    resBody: BybitResponse<Position[]>
  }
}
