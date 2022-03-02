import { DBSchema } from 'idb'
import type { IdbUgpradeCb, IdbSchema } from 'src/idb/idb.schema'

export interface LastWriteIdbStore {
  storeName: keyof IdbSchema
  lastWrite: Date
}

export interface KeyvalIdbStore extends DBSchema {
  lastWrite: {
    key: string
    value: Date
  }
}

const upgradeCb: IdbUgpradeCb = (db) => {
  db.createObjectStore('lastWrite', {
    keyPath: 'storeName',
  })

  console.debug('IndexedDB-promised: lastWrite store upgraded.')
}

export default upgradeCb
