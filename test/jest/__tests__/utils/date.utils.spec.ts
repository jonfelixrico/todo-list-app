import { getMaxDate, getMinDate } from 'src/utils/date.utils'
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
