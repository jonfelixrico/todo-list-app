import { DBSchema, OpenDBCallbacks } from 'idb'
import { Task } from 'src/typings/task.interface'

interface KeyvalIdbStore extends DBSchema {
  keyVal: {
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

interface DaysWithTasksIdbStore extends DBSchema {
  daysWithTasks: {
    key: number
    value: number
  }
}

export type IdbSchema = KeyvalIdbStore & TasksIdbStore & DaysWithTasksIdbStore

export type IdbUgpradeCb = NonNullable<OpenDBCallbacks<IdbSchema>['upgrade']>
