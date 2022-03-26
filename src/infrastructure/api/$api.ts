/* eslint-disable */
// prettier-ignore
import type { AspidaClient } from 'aspida'
// prettier-ignore
import { dataToURLString } from 'aspida'
// prettier-ignore
import type { Methods as Methods0 } from './linear/kline'
// prettier-ignore
import type { Methods as Methods1 } from './private/linear/order/create'
// prettier-ignore
import type { Methods as Methods2 } from './public/linear/kline'
// prettier-ignore
import type { Methods as Methods3 } from './v2/public/kline/linear/list'
// prettier-ignore
import type { Methods as Methods4 } from './v2/public/linear/kline'
// prettier-ignore
import type { Methods as Methods5 } from './v2/public/linear/list'
// prettier-ignore
import type { Methods as Methods6 } from './v2/public/open-interest'
// prettier-ignore
import type { Methods as Methods7 } from './v2/public/symbols'

// prettier-ignore
const api = <T>({ baseURL, fetch }: AspidaClient<T>) => {
  const prefix = (baseURL === undefined ? '' : baseURL).replace(/\/$/, '')
  const PATH0 = '/linear/kline'
  const PATH1 = '/private/linear/order/create'
  const PATH2 = '/public/linear/kline'
  const PATH3 = '/v2/public/kline/linear/list'
  const PATH4 = '/v2/public/linear/kline'
  const PATH5 = '/v2/public/linear/list'
  const PATH6 = '/v2/public/open-interest'
  const PATH7 = '/v2/public/symbols'
  const GET = 'GET'
  const POST = 'POST'

  return {
    linear: {
      kline: {
        $get: (option: { query: Methods0['get']['query'], config?: T }) =>
          fetch<Methods0['get']['resBody']>(prefix, PATH0, GET, option).json().then(r => r.body),
        $path: (option?: { method?: 'get'; query: Methods0['get']['query'] }) =>
          `${prefix}${PATH0}${option && option.query ? `?${dataToURLString(option.query)}` : ''}`
      }
    },
    private: {
      linear: {
        order: {
          create: {
            $post: (option: { body: Methods1['post']['reqBody'], config?: T }) =>
              fetch(prefix, PATH1, POST, option).send().then(r => r.body),
            $path: () => `${prefix}${PATH1}`
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
        kline: {
          linear: {
            list: {
              $get: (option: { query: Methods3['get']['query'], config?: T }) =>
                fetch<Methods3['get']['resBody']>(prefix, PATH3, GET, option).json().then(r => r.body),
              $path: (option?: { method?: 'get'; query: Methods3['get']['query'] }) =>
                `${prefix}${PATH3}${option && option.query ? `?${dataToURLString(option.query)}` : ''}`
            }
          }
        },
        linear: {
          kline: {
            $get: (option: { query: Methods4['get']['query'], config?: T }) =>
              fetch<Methods4['get']['resBody']>(prefix, PATH4, GET, option).json().then(r => r.body),
            $path: (option?: { method?: 'get'; query: Methods4['get']['query'] }) =>
              `${prefix}${PATH4}${option && option.query ? `?${dataToURLString(option.query)}` : ''}`
          },
          list: {
            $get: (option: { query: Methods5['get']['query'], config?: T }) =>
              fetch<Methods5['get']['resBody']>(prefix, PATH5, GET, option).json().then(r => r.body),
            $path: (option?: { method?: 'get'; query: Methods5['get']['query'] }) =>
              `${prefix}${PATH5}${option && option.query ? `?${dataToURLString(option.query)}` : ''}`
          }
        },
        open_interest: {
          $get: (option?: { query?: Methods6['get']['query'], config?: T }) =>
            fetch<Methods6['get']['resBody']>(prefix, PATH6, GET, option).json().then(r => r.body),
          $path: (option?: { method?: 'get'; query: Methods6['get']['query'] }) =>
            `${prefix}${PATH6}${option && option.query ? `?${dataToURLString(option.query)}` : ''}`
        },
        symbols: {
          $get: (option?: { config?: T }) =>
            fetch<Methods7['get']['resBody']>(prefix, PATH7, GET, option).json().then(r => r.body),
          $path: () => `${prefix}${PATH7}`
        }
      }
    }
  }
}

// prettier-ignore
export type ApiInstance = ReturnType<typeof api>
// prettier-ignore
export default api
