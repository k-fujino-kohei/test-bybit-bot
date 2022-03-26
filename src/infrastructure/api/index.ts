import $api from '@/infrastructure/api/$api'
import aspida from '@aspida/axios'
import axios from 'axios'
import hmacSHA256 from 'crypto-js/hmac-sha256'
import { toCamel } from 'snake-camel'

const api = (config: { key: string, secret: string, useTestnet?: boolean }) => {
  const axiosConfig = {
    baseURL: 'https://api-testnet.bybit.com'
  }

  axios.interceptors.request.use(request => {
    if (request.params) {
      request.params = setAuth(request.params, config)
    }
    if (request.data) {
      request.data = setAuth(request.data, config)
    }
    return request
  })

  axios.interceptors.response.use(response => {
    response.data = toCamel(response.data)
    return response
  })

  return $api(aspida(axios, axiosConfig))
}

export type ApiInstance = ReturnType<typeof api>
export default api

/// https://bybit-exchange.github.io/docs/inverse/#t-constructingtherequest
const setAuth = (requestParams: { [x: string]: any }, config: { key: string, secret: string }) => {
  const params = {
    api_key: config.key,
    timestamp: Date.now(),
    ...requestParams ?? {}
  }
  const sign = hmacSHA256(serializeParams(params), config.secret).toString()
  return { ...params, sign }
}

const serializeParams = (params: { [x: string]: any }) => {
  return Object.keys(params)
    .sort()
    .map(key => {
      const value = params[key]
      return `${key}=${value}`
    })
    .join('&')
}
