import { getMinDate } from 'src/utils/date.utils'
import { describe, expect, it } from '@jest/globals'

describe('getMinDate', () => {
  const expectedMinDate = new Date('1998/06/21')
  const referenceDate = new Date('2022/1/1')

  it('can get the minimum date given an array of dates', () => {
    const res = getMinDate(referenceDate, new Date(), expectedMinDate)
    expect(res).toEqual(expectedMinDate)
  })

  it('will give the start of epoch date if used empty', () => {
    expect(getMinDate()).toEqual(new Date(0))
  })
})
