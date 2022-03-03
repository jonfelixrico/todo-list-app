import { getDaysBetween, getMaxDate, getMinDate } from 'src/utils/date.utils'
import { describe, expect, it } from '@jest/globals'

const min = new Date('1998/06/21')
const mid = new Date('2022/1/1')
const max = new Date('2077/1/1')

describe('getMinDate', () => {
  it('can get the earliest date given an array of dates', () => {
    const res = getMinDate(min, mid, max)
    expect(res).toEqual(min)
  })

  it('will give the start of epoch date if used empty', () => {
    expect(getMinDate()).toEqual(new Date(0))
  })
})

describe('getMaxDate', () => {
  it('can get the latest date given an array of dates', () => {
    const res = getMaxDate(min, mid, max)
    expect(res).toEqual(max)
  })

  it('will give the start of epoch date if used empty', () => {
    expect(getMaxDate()).toEqual(new Date(0))
  })
})

describe('getDaysBetween', () => {
  const start = new Date('1998/06/16')
  const end = new Date('1998/06/21')

  const results = getDaysBetween(start, end)

  it('will have the start as the first item', () => {
    expect(results[0]).toEqual(start)
  })

  it('will have the end as the last item', () => {
    expect(results[results.length - 1]).toEqual(end)
  })

  it('will have 6 items', () => {
    expect(results.length).toBe(6)
  })
})
