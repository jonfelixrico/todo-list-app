import { DBSchema } from 'idb'
import type { IdbUgpradeCb } from 'src/idb/idb.schema'

export interface LastWriteEntry {
  storeName: 'tasks'
  lastWriteDt: Date
}

export interface LastWriteIdbStore extends DBSchema {
  lastWrite: {
    key: string
    value: LastWriteEntry
  }
}

const upgradeCb: IdbUgpradeCb = (db) => {
  db.createObjectStore('lastWrite', {
    keyPath: 'storeName',
  })

  console.debug('IndexedDB-promised: lastWrite store upgraded.')
}

export default upgradeCb
