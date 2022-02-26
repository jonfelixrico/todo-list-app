import { OpenDBCallbacks } from 'idb'

export type IDBUpgradeCallback<DBSchema> = OpenDBCallbacks<DBSchema>['upgrade']
