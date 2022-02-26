import { OpenDBCallbacks } from 'idb'

export type IDBUpgradeCallback<DBSchema> = NonNullable<
  OpenDBCallbacks<DBSchema>['upgrade']
>
