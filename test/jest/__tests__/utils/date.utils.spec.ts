import { getDaysBetween } from 'src/utils/date.utils'
import { describe, expect, it } from '@jest/globals'
import { DateTime } from 'luxon'

describe('getDaysBetween', () => {
  const start = DateTime.fromISO('1998-06-16')
  const end = DateTime.fromISO('1998-06-21')

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
