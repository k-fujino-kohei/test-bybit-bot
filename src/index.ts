import { formatISO } from 'date-fns'
import { trade } from './usecases/simpleTrade'
import dotenv from 'dotenv'

const config = () => {
  const env = (() => {
    dotenv.config()
    const env = process.env
    return {
      API_KEY: env.API_KEY!,
      API_SECRET: env.API_SECRET!
    }
  })()
  return {
    env
  }
}

exports.autoTrade = async () => {
  console.log(`start: ${formatISO(new Date())}`)
  try {
    const { env } = config()
    await trade({
      apiKey: env.API_KEY,
      apiSecret: env.API_SECRET,
      useLiveNet: false
    })
  } catch (err) {
    console.error(err)
  }
}
