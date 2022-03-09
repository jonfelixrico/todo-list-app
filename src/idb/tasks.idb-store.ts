import { DBSchema } from 'idb'
import type { IdbUgpradeCb } from 'src/idb/idb.schema'

export interface IdbTask {
  title: string
  notes: string | null
  priority: number
  dueDt: Date
  carryOverUntil: Date

  completeDt: Date | null

  id: string
  createDt: Date
  lastUpdateDt: Date

  $activeMillis: number[]
}

export interface TasksIdbStore extends DBSchema {
  tasks: {
    key: string
    value: IdbTask
    indexes: {
      activeMillis: number
    }
  }
}

const upgradeCb: IdbUgpradeCb = (db) => {
  const store = db.createObjectStore('tasks', {
    keyPath: 'id',
  })

  store.createIndex('activeMillis', '$activeMillis', {
    multiEntry: true,
    unique: false,
  })

  console.debug('IndexedDB-promised: task store upgraded.')
}

export default upgradeCb
