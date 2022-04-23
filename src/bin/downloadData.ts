import { config } from '@/config'
import { DataStore } from '@/crawler/db'
import downloadData from '@/crawler/downloadData'

const { env } = config()
const db = new DataStore(env.DB_URL, env.DB_KEY)

downloadData(db, { to: new Date() })
  .then()
  .catch(err => console.error(err))
