import { sub, Duration, format, setMinutes, setSeconds, setMilliseconds } from 'date-fns'
import { DataStore } from './db'
import { stringify } from 'csv/sync'
import tmp from 'tmp'
import fs from 'fs/promises'
import { GoogleDrive } from './storage'

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
  from: Date,
  to: Date
}): Promise<Summary[]> => {
  const summary = await db.rpc<Summary>('get_summaries', {
    p_from_datetime: params.from,
    p_to_datetime: params.to,
    p_gen_interval: '1 seconds',
    p_unit: 'seconds'
  })
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

const uploadCSV = async (name: string, path: string, uploadTo: string): Promise<string> => {
  // TODO: 月・日付毎にフォルダ分けたい
  const drive = new GoogleDrive()
  const nameWithExt = name.endsWith('.csv') ? name : name.concat('.csv')
  const res = await drive.upload({ name: nameWithExt, path }, uploadTo)
  return res.name
}

const main = async (db: DataStore, params: {
  to: Date
}) => {
  const duration: Duration = { hours: 1 }
  // 00分00秒から59分59秒までの時間を設定する
  const toJust = setMilliseconds(setSeconds(setMinutes(params.to, 0), 0), 0)
  const from = sub(toJust, duration)
  const to = sub(toJust, { seconds: 1 })
  console.log(`DownloadData: ${from.toISOString()} ~ ${to.toISOString()}`)
  const data = await downloadSummaryData(db, { from, to })
  console.log(`Downloaded rows: ${data?.length ?? 0}`)
  const path = await saveToCSV(data)
  const fileName = format(from, 'yyyy_MMdd_hh')
  // /** NOTE: `/summary/`のID */
  const summaryId = '1VP6fXLcvINKw2BfuwU0upvDlHM9rdxbE' as const
  const uploadedFile = await uploadCSV(fileName, path, summaryId)
  console.log(`Uploaded: ${uploadedFile}`)
}

export default main
