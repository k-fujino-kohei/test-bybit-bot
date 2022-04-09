import dotenv from 'dotenv'

export const config = () => {
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
