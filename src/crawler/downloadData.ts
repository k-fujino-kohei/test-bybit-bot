import { sub, Duration } from 'date-fns'
import { DataStore } from './db'
import { stringify } from 'csv/sync'
import tmp from 'tmp'
import fs from 'fs/promises'

interface Summary {
  ts: string
  open: number
  low: number
  high: number
  close: number
  // eslint-disable-next-line camelcase
  sell_volume: number
  // eslint-disable-next-line camelcase
  buy_volume: number
  oi: number
  // eslint-disable-next-line camelcase
  sell_liq_size: number
  // eslint-disable-next-line camelcase
  buy_liq_size: number
}

const downloadSummaryData = async (db: DataStore, params: {
  to: Date
  duration: Duration
}): Promise<Summary[]> => {
  const from = sub(params.to, params.duration)
  console.log(`DownloadData: ${from.toISOString()} ~ ${params.to.toISOString()}`)
  const summary = await db.rpc<Summary>('get_summaries', {
    p_from_datetime: from,
    p_to_datetime: params.to,
    p_gen_interval: '1 seconds',
    p_unit: 'seconds'
  })
  console.log(`Downloaded rows: ${summary.data?.length ?? 0}`)
  return summary.data ?? []
}

const saveToCSV = <T>(data: T[]): Promise<string> => {
  const csvStr = stringify(data, { header: true })
  return new Promise((resolve, reject) => {
    tmp.file(async (err, path) => {
      if (err) {
        reject(err)
      }
      await fs.writeFile(path, csvStr)
      resolve(path)
    })
  })
}

const uploadCSV = async (path: string) => {
  console.log(path)
  // const buf = await fs.readFile(path, { encoding: 'utf8' })
  // console.log(buf)
}

const main = async (db: DataStore, params: {
  to: Date
  duration: Duration
}) => {
  const data = await downloadSummaryData(db, params)
  const path = await saveToCSV(data)
  await uploadCSV(path)
}

export default main
