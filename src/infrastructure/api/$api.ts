/* eslint-disable */
// prettier-ignore
import type { AspidaClient } from 'aspida'
// prettier-ignore
import { dataToURLString } from 'aspida'
// prettier-ignore
import type { Methods as Methods0 } from './v2/public/open-interest'

// prettier-ignore
const api = <T>({ baseURL, fetch }: AspidaClient<T>) => {
  const prefix = (baseURL === undefined ? '' : baseURL).replace(/\/$/, '')
  const PATH0 = '/v2/public/open-interest'
  const GET = 'GET'

  return {
    v2: {
      public: {
        open_interest: {
          $get: (option?: { query?: Methods0['get']['query'], config?: T }) =>
            fetch<Methods0['get']['resBody']>(prefix, PATH0, GET, option).json().then(r => r.body),
          $path: (option?: { method?: 'get'; query: Methods0['get']['query'] }) =>
            `${prefix}${PATH0}${option && option.query ? `?${dataToURLString(option.query)}` : ''}`
        }
      }
    }
  }
}

// prettier-ignore
export type ApiInstance = ReturnType<typeof api>
// prettier-ignore
export default api
