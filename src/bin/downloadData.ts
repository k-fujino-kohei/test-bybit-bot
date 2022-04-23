import { config } from '@/config'
import { DataStore } from '@/crawler/db'
import downloadData from '@/crawler/downloadData'

const { env } = config()
const db = new DataStore(env.DB_URL, env.DB_KEY)

downloadData(db, { to: new Date(), duration: { hours: 1 } })
  .then()
  .catch(err => console.error(err))
