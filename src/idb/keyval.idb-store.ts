import { IdbUgpradeCb } from 'src/idb/idb.schema'

const upgradeCb: IdbUgpradeCb = (db) => {
  db.createObjectStore('keyval')
  console.debug('IndexedDB-promised: keyval store upgraded.')
}

export default upgradeCb
