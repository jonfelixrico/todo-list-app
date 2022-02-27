import { IdbUgpradeCb } from 'src/idb/idb.schema'

const upgradeCb: IdbUgpradeCb = (db) => {
  const store = db.createObjectStore('tasks', {
    keyPath: 'id',
  })

  store.createIndex('referenceDates', ['dueDt', 'carryOverUntil'], {
    multiEntry: true,
  })

  console.debug('IndexedDB-promised: task store upgraded.')
}

export default upgradeCb
