import dotenv from 'dotenv'

export const config = () => {
  const env = (() => {
    dotenv.config()
    const env = process.env
    return {
      API_KEY: env.API_KEY!,
      API_SECRET: env.API_SECRET!,
      DB_URL: env.DB_URL!,
      DB_KEY: env.DB_KEY!
    }
  })()
  return {
    env
  }
}

export type Config = ReturnType<typeof config>
export type Env = Pick<Config, 'env'>['env']
