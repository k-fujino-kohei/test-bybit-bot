/* eslint-disable */
// prettier-ignore
import type { AspidaClient } from 'aspida'
// prettier-ignore
import { dataToURLString } from 'aspida'
// prettier-ignore
import type { Methods as Methods0 } from './public/linear/kline'
// prettier-ignore
import type { Methods as Methods1 } from './v2/public/open-interest'
// prettier-ignore
import type { Methods as Methods2 } from './v2/public/symbols'

// prettier-ignore
const api = <T>({ baseURL, fetch }: AspidaClient<T>) => {
  const prefix = (baseURL === undefined ? '' : baseURL).replace(/\/$/, '')
  const PATH0 = '/public/linear/kline'
  const PATH1 = '/v2/public/open-interest'
  const PATH2 = '/v2/public/symbols'
  const GET = 'GET'

  return {
    public: {
      linear: {
        kline: {
          $get: (option: { query: Methods0['get']['query'], config?: T }) =>
            fetch<Methods0['get']['resBody']>(prefix, PATH0, GET, option).json().then(r => r.body),
          $path: (option?: { method?: 'get'; query: Methods0['get']['query'] }) =>
            `${prefix}${PATH0}${option && option.query ? `?${dataToURLString(option.query)}` : ''}`
        }
      }
    },
    v2: {
      public: {
        open_interest: {
          $get: (option?: { query?: Methods1['get']['query'], config?: T }) =>
            fetch<Methods1['get']['resBody']>(prefix, PATH1, GET, option).json().then(r => r.body),
          $path: (option?: { method?: 'get'; query: Methods1['get']['query'] }) =>
            `${prefix}${PATH1}${option && option.query ? `?${dataToURLString(option.query)}` : ''}`
        },
        symbols: {
          $get: (option?: { config?: T }) =>
            fetch<Methods2['get']['resBody']>(prefix, PATH2, GET, option).json().then(r => r.body),
          $path: () => `${prefix}${PATH2}`
        }
      }
    }
  }
}

// prettier-ignore
export type ApiInstance = ReturnType<typeof api>
// prettier-ignore
export default api
