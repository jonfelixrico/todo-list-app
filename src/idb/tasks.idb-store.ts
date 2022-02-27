import { DBSchema } from 'idb'
import type { IdbUgpradeCb } from 'src/idb/idb.schema'
import { Task } from 'src/typings/task.interface'

export interface TasksIdbStore extends DBSchema {
  tasks: {
    key: string
    value: Task
    indexes: {
      referenceDates: Date
    }
  }
}

const upgradeCb: IdbUgpradeCb = (db) => {
  const store = db.createObjectStore('tasks', {
    keyPath: 'id',
  })

  store.createIndex('referenceDates', ['dueDt', 'carryOverUntil'], {
    multiEntry: true,
  })

  console.debug('IndexedDB-promised: task store upgraded.')
}

export default upgradeCb
