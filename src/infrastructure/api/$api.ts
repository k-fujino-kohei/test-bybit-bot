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
import type { Methods as Methods2 } from './private/linear/position/trading-stop'
// prettier-ignore
import type { Methods as Methods3 } from './public/linear/kline'
// prettier-ignore
import type { Methods as Methods4 } from './v2/public/open-interest'
// prettier-ignore
import type { Methods as Methods5 } from './v2/public/symbols'

// prettier-ignore
const api = <T>({ baseURL, fetch }: AspidaClient<T>) => {
  const prefix = (baseURL === undefined ? '' : baseURL).replace(/\/$/, '')
  const PATH0 = '/private/linear/order/create'
  const PATH1 = '/private/linear/position/list'
  const PATH2 = '/private/linear/position/trading-stop'
  const PATH3 = '/public/linear/kline'
  const PATH4 = '/v2/public/open-interest'
  const PATH5 = '/v2/public/symbols'
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
          },
          trading_stop: {
            $post: (option: { body: Methods2['post']['reqBody'], config?: T }) =>
              fetch(prefix, PATH2, POST, option).send().then(r => r.body),
            $path: () => `${prefix}${PATH2}`
          }
        }
      }
    },
    public: {
      linear: {
        kline: {
          $get: (option: { query: Methods3['get']['query'], config?: T }) =>
            fetch<Methods3['get']['resBody']>(prefix, PATH3, GET, option).json().then(r => r.body),
          $path: (option?: { method?: 'get'; query: Methods3['get']['query'] }) =>
            `${prefix}${PATH3}${option && option.query ? `?${dataToURLString(option.query)}` : ''}`
        }
      }
    },
    v2: {
      public: {
        open_interest: {
          $get: (option?: { query?: Methods4['get']['query'], config?: T }) =>
            fetch<Methods4['get']['resBody']>(prefix, PATH4, GET, option).json().then(r => r.body),
          $path: (option?: { method?: 'get'; query: Methods4['get']['query'] }) =>
            `${prefix}${PATH4}${option && option.query ? `?${dataToURLString(option.query)}` : ''}`
        },
        symbols: {
          $get: (option?: { config?: T }) =>
            fetch<Methods5['get']['resBody']>(prefix, PATH5, GET, option).json().then(r => r.body),
          $path: () => `${prefix}${PATH5}`
        }
      }
    }
  }
}

// prettier-ignore
export type ApiInstance = ReturnType<typeof api>
// prettier-ignore
export default api
