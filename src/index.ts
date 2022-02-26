import { formatISO } from 'date-fns'
import { trade } from './usecase'

exports.autoTrade = async () => {
  console.log(`start: ${formatISO(new Date())}`)
  try {
    await trade()
  } catch (err) {
    console.error(err)
  }
}
