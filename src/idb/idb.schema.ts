import { OpenDBCallbacks } from 'idb'
import type { TasksIdbStore } from 'src/idb/tasks.idb-store'
import type { LastWriteIdbStore } from 'src/idb/last-write.idb-store'

export type IdbSchema = TasksIdbStore & LastWriteIdbStore
export type IdbUgpradeCb = NonNullable<OpenDBCallbacks<IdbSchema>['upgrade']>
