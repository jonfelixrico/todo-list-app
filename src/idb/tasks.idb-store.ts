import { DBSchema } from 'idb'
import { IDBUpgradeCallback } from 'src/idb/idb.types'
import { Task } from 'src/typings/task.interface'

// TODO remove this

export interface TasksIdbStore extends DBSchema {
  tasks: {
    key: string
    value: Task
    indexes: {
      referenceDates: Date
    }
  }
}

const upgradeCb: IDBUpgradeCallback<TasksIdbStore> = (db) => {
  const store = db.createObjectStore('tasks', {
    keyPath: 'id',
  })

  store.createIndex('referenceDates', ['dueDt', 'carryOverUntil'], {
    multiEntry: true,
  })

  console.debug('IndexedDB-promised: task store upgraded.')
}

export default upgradeCb
