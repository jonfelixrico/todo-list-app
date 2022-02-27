import { DBSchema, OpenDBCallbacks } from 'idb'
import { Task } from 'src/typings/task.interface'

interface KeyvalIdbStore extends DBSchema {
  keyval: {
    key: string
    value: string
  }
}

interface TasksIdbStore extends DBSchema {
  tasks: {
    key: string
    value: Task
    indexes: {
      referenceDates: Date
    }
  }
}

export type IdbSchema = KeyvalIdbStore & TasksIdbStore

export type IdbUgpradeCb = NonNullable<OpenDBCallbacks<IdbSchema>['upgrade']>
