import { Symbol } from '@/domains/models'
import { BybitResponse } from '@/infrastructure/api/baseResponse'

export interface Methods {
  get: {
    resBody: BybitResponse<Symbol[]>
  }
}
