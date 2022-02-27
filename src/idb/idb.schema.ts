import { OpenDBCallbacks } from 'idb'
import type { DaysWithTasksIdbStore } from 'src/idb/days-with-tasks.idb-store'
import type { KeyvalIdbStore } from 'src/idb/keyval.idb-store'
import type { TasksIdbStore } from 'src/idb/tasks.idb-store'

export type IdbSchema = KeyvalIdbStore & TasksIdbStore & DaysWithTasksIdbStore
export type IdbUgpradeCb = NonNullable<OpenDBCallbacks<IdbSchema>['upgrade']>
