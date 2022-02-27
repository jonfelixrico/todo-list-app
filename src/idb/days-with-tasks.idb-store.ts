import { IdbUgpradeCb } from 'src/idb/idb.schema'

const upgradeCb: IdbUgpradeCb = (db) => {
  db.createObjectStore('daysWithTasks')
  console.debug('IndexedDB-promised: daysWithTasks store upgraded.')
}

export default upgradeCb
