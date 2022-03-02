import { DBSchema } from 'idb'
import type { IdbUgpradeCb } from 'src/idb/idb.schema'
import { Task } from 'src/typings/task.interface'

export interface IdbTask extends Task {
  $activeDates: Date[]
}

export interface TasksIdbStore extends DBSchema {
  tasks: {
    key: string
    value: IdbTask
    indexes: {
      /** @deprecated */
      dueDt: Date
      /** @deprecated */
      carryOverUntil: Date
      activeDates: Date
    }
  }
}

const upgradeCb: IdbUgpradeCb = (db) => {
  const store = db.createObjectStore('tasks', {
    keyPath: 'id',
  })

  store.createIndex('activeDates', '$activeDates', {
    multiEntry: true,
    unique: false,
  })

  console.debug('IndexedDB-promised: task store upgraded.')
}

export default upgradeCb
