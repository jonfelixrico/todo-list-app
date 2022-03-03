import { DBSchema } from 'idb'
import type { IdbUgpradeCb } from 'src/idb/idb.schema'
import { Task } from 'src/typings/task.interface'

export interface IdbTask extends Task {
  /**
   * This is for the sake of indexing so we can easily look up active/carried-over tasks.
   * This is not part of the task entity, this is just for DB use.
   */
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
