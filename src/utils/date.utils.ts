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
