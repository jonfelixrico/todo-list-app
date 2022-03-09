import { DateTime } from 'luxon'

/**
 * Gets the days between a start and end date. Inclusive.
 * @param start
 * @param end
 * @returns The first item is the start of day of `start`. The last item is the
 * start of day of `end`. The items in between are the start of day of the individual
 * days in between.
 */
export function getDaysBetween(start: DateTime, end: DateTime): DateTime[] {
  const oStart = start
  const oEnd = end

  start = DateTime.min(oStart, oEnd).startOf('day')
  end = DateTime.max(oStart, oEnd).startOf('day')
  const daysBetween = end.diff(start, 'day').days

  const dates: DateTime[] = []
  for (let daysToAdd = 0; daysToAdd <= daysBetween; daysToAdd++) {
    dates.push(start.plus({ days: daysToAdd }))
  }

  return dates
}
