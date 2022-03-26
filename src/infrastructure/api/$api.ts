/* eslint-disable */
// prettier-ignore
import type { AspidaClient } from 'aspida'
// prettier-ignore
import { dataToURLString } from 'aspida'
// prettier-ignore
import type { Methods as Methods0 } from './private/linear/order/create'
// prettier-ignore
import type { Methods as Methods1 } from './private/linear/position/list'
// prettier-ignore
import type { Methods as Methods2 } from './public/linear/kline'
// prettier-ignore
import type { Methods as Methods3 } from './v2/public/open-interest'
// prettier-ignore
import type { Methods as Methods4 } from './v2/public/symbols'

// prettier-ignore
const api = <T>({ baseURL, fetch }: AspidaClient<T>) => {
  const prefix = (baseURL === undefined ? '' : baseURL).replace(/\/$/, '')
  const PATH0 = '/private/linear/order/create'
  const PATH1 = '/private/linear/position/list'
  const PATH2 = '/public/linear/kline'
  const PATH3 = '/v2/public/open-interest'
  const PATH4 = '/v2/public/symbols'
  const GET = 'GET'
  const POST = 'POST'

  return {
    private: {
      linear: {
        order: {
          create: {
            $post: (option: { body: Methods0['post']['reqBody'], config?: T }) =>
              fetch(prefix, PATH0, POST, option).send().then(r => r.body),
            $path: () => `${prefix}${PATH0}`
          }
        },
        position: {
          list: {
            $get: (option: { query: Methods1['get']['query'], config?: T }) =>
              fetch<Methods1['get']['resBody']>(prefix, PATH1, GET, option).json().then(r => r.body),
            $path: (option?: { method?: 'get'; query: Methods1['get']['query'] }) =>
              `${prefix}${PATH1}${option && option.query ? `?${dataToURLString(option.query)}` : ''}`
          }
        }
      }
    },
    public: {
      linear: {
        kline: {
          $get: (option: { query: Methods2['get']['query'], config?: T }) =>
            fetch<Methods2['get']['resBody']>(prefix, PATH2, GET, option).json().then(r => r.body),
          $path: (option?: { method?: 'get'; query: Methods2['get']['query'] }) =>
            `${prefix}${PATH2}${option && option.query ? `?${dataToURLString(option.query)}` : ''}`
        }
      }
    },
    v2: {
      public: {
        open_interest: {
          $get: (option?: { query?: Methods3['get']['query'], config?: T }) =>
            fetch<Methods3['get']['resBody']>(prefix, PATH3, GET, option).json().then(r => r.body),
          $path: (option?: { method?: 'get'; query: Methods3['get']['query'] }) =>
            `${prefix}${PATH3}${option && option.query ? `?${dataToURLString(option.query)}` : ''}`
        },
        symbols: {
          $get: (option?: { config?: T }) =>
            fetch<Methods4['get']['resBody']>(prefix, PATH4, GET, option).json().then(r => r.body),
          $path: () => `${prefix}${PATH4}`
        }
      }
    }
  }
}

// prettier-ignore
export type ApiInstance = ReturnType<typeof api>
// prettier-ignore
export default api
