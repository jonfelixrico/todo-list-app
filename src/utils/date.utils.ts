/**
import { date } from 'quasar';
 * Returns the smallest date in terms of their time millis.
 *
 * @param dates
 * @returns The smallest date. If empty `dates` arugment was provided, then the
 * start of the epoch will be returned instead (1970/1/1).
 */
export function getMinDate(...dates: Date[]) {
  const converted = dates.map((date) => +date)
  const minVal = Math.min(...converted)
  return new Date(minVal === Infinity ? 0 : minVal)
}
