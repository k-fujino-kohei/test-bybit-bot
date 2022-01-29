/**
 * RSIを計算する
 * @param values 値
 * @param interval 計算期間
 * @returns 各RSI(長さは`values.length - interval.length`)
 */
export const getRSI = (values: number[], interval: number): number[] => {
  if (values.length < 2 || values.length < interval) {
    throw new Error('値の数が指定された計算期間に満たないためRSIを計算できません')
  }

  const pastValues = values.slice(0, interval + 1)
  const currentValues = values.slice(interval + 1)

  let sumIncreased: number = 0
  let sumDecreased: number = 0

  pastValues.forEach((v, idx) => {
    if (idx <= 0) {
      return
    }
    const diff = v - pastValues[idx - 1]
    if (diff > 0) {
      sumIncreased += diff
    } else {
      sumDecreased += Math.abs(diff)
    }
  })
  sumIncreased /= interval
  sumDecreased /= interval

  const rsiList = currentValues.map((v, idx) => {
    const diff = idx <= 0
      ? v - pastValues[pastValues.length - 1]
      : v - currentValues[idx - 1]
    if (diff > 0) {
      sumIncreased = ((sumIncreased * (interval - 1)) + diff) / interval
      sumDecreased = (sumDecreased * (interval - 1)) / interval
    } else {
      sumIncreased = (sumIncreased * (interval - 1)) / interval
      sumDecreased = ((sumDecreased * (interval - 1)) + Math.abs(diff)) / interval
    }
    const rsi = (sumIncreased / (sumIncreased + sumDecreased)) * 100.0
    return rsi
  })

  return rsiList
}

// TODO: jestで実行する
// const values = [
//   1000, 1020, 1010, 1030, 1040,
//   1050, 1080, 1070, 1050, 1090,
//   1100, 1120, 1110, 1120, 1100,
//   1080
// ]
// const rsi = getRSI(values, 14)
// assert([65], rsi)