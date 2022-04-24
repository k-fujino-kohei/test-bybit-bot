import dotenv from 'dotenv'

export const config = () => {
  const NODE_ENV = process.env.NODE_ENV ?? 'development'
  const isDebug = !(NODE_ENV !== 'development')
  const env = (() => {
    if (isDebug) {
      dotenv.config({ path: '.env', debug: true })
    } else {
      dotenv.config({ path: '.env.prod' })
    }
    return {
      NODE_ENV,
      API_KEY: process.env.API_KEY!,
      API_SECRET: process.env.API_SECRET!,
      DB_URL: process.env.DB_URL!,
      DB_KEY: process.env.DB_KEY!
    }
  })()
  return {
    env,
    isDebug
  }
}

export type Config = ReturnType<typeof config>
export type Env = Config['env']
