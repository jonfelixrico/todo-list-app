import { DBSchema } from 'idb'
import { IDBUpgradeCallback } from 'src/idb/idb.types'
import { Task } from 'src/typings/task.interface'

export interface TasksIdbStore extends DBSchema {
  tasks: {
    key: string
    value: Task
    indexes: {
      deadlineDt: Date
      createDt: Date
      completeDt: Date
    }
  }
}

const upgradeCb: IDBUpgradeCallback<TasksIdbStore> = (db) => {
  const store = db.createObjectStore('tasks', {
    keyPath: 'id',
  })

  store.createIndex('createDt', 'createDt')
  store.createIndex('deadlineDt', 'deadlineDt')
  store.createIndex('completeDt', 'copmleteDt')

  console.debug('IndexedDB-promised: task store upgraded.')
}

export default upgradeCb
