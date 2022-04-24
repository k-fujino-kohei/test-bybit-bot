import { config } from '@/config'
import { DataStore } from '@/crawler/db'
import downloadData from '@/crawler/downloadData'

const main = async () => {
  const { env } = config()
  const db = new DataStore(env.DB_URL, env.DB_KEY)

  try {
    await downloadData(db, { to: new Date() })
  } catch (err) {
    console.error(err)
  }
}

exports.downloadData = main
