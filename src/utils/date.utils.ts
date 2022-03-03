import { date } from 'quasar'

const START_OF_EPOCH = new Date(0)

/**
 * Returns the smallest date in terms of their time millis.
 *
 * @param dates
 * @returns The smallest date. If empty `dates` arugment was provided, then the
 * start of the epoch will be returned instead (1970/1/1).
 */
export function getMinDate(...dates: Date[]): Date {
  if (!dates.length) {
    return START_OF_EPOCH
  }

  const converted = dates.map((date) => +date)
  return new Date(Math.min(...converted))
}

/**
 * Returns the largest date in terms of their time millis.
 *
 * @param dates
 * @returns The largest date. If empty `dates` arugment was provided, then the
 * start of the epoch will be returned instead (1970/1/1).
 */
export function getMaxDate(...dates: Date[]): Date {
  if (!dates.length) {
    return START_OF_EPOCH
  }

  const converted = dates.map((date) => +date)
  return new Date(Math.max(...converted))
}

/**
 * Gets the days between a start and end date. Inclusive.
 * @param start
 * @param end
 * @returns The first item is the start of day of `start`. The last item is the
 * start of day of `end`. The items in between are the start of day of the individual
 * days in between.
 */
export function getDaysBetween(start: Date, end: Date): Date[] {
  const oStart = start
  const oEnd = end

  start = date.startOfDate(getMinDate(oStart, oEnd), 'day')
  end = date.startOfDate(getMaxDate(oStart, oEnd), 'day')
  const daysBetween = date.getDateDiff(end, start, 'days')

  const dates: Date[] = []
  for (let daysToAdd = 0; daysToAdd <= daysBetween; daysToAdd++) {
    dates.push(date.addToDate(start, { days: daysToAdd }))
  }

  return dates
}
