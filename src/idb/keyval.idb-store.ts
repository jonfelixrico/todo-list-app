import { DBSchema } from 'idb'
import type { IdbUgpradeCb } from 'src/idb/idb.schema'

export interface KeyvalIdbStore extends DBSchema {
  keyVal: {
    key: string
    value: string
  }
}

const upgradeCb: IdbUgpradeCb = (db) => {
  db.createObjectStore('keyVal')
  console.debug('IndexedDB-promised: keyVal store upgraded.')
}

export default upgradeCb
