import { DBSchema } from 'idb'
import type { IdbUgpradeCb } from 'src/idb/idb.schema'

export interface DaysWithTasksEntry {
  date: Date
  count: number
}

export interface DaysWithTasksIdbStore extends DBSchema {
  daysWithTasks: {
    key: Date
    value: DaysWithTasksEntry
  }
}

const upgradeCb: IdbUgpradeCb = (db) => {
  db.createObjectStore('daysWithTasks', {
    keyPath: 'date',
  })
  console.debug('IndexedDB-promised: daysWithTasks store upgraded.')
}

export default upgradeCb
