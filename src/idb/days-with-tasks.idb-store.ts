import { DBSchema } from 'idb'
import type { IdbUgpradeCb } from 'src/idb/idb.schema'

export interface DaysWithTasksIdbStore extends DBSchema {
  daysWithTasks: {
    key: number
    value: number
  }
}

const upgradeCb: IdbUgpradeCb = (db) => {
  db.createObjectStore('daysWithTasks')
  console.debug('IndexedDB-promised: daysWithTasks store upgraded.')
}

export default upgradeCb
