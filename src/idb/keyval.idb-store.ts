import { IdbUgpradeCb } from 'src/idb/idb.schema'

const upgradeCb: IdbUgpradeCb = (db) => {
  db.createObjectStore('keyVal')
  console.debug('IndexedDB-promised: keyVal store upgraded.')
}

export default upgradeCb
