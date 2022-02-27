import { openDB } from 'idb'
import tasksUpgradeCb from './tasks.idb-store'
import keyvalUpgradeCb from './keyval.idb-store'
import { IdbSchema } from 'src/idb/idb.schema'

const DB_NAME = 'todo.idb'
// TODO update this per schema change
const DB_VERSION = 1

export async function start() {
  const db = await openDB<IdbSchema>(DB_NAME, DB_VERSION, {
    upgrade(...args) {
      tasksUpgradeCb(...args)
      keyvalUpgradeCb(...args)
      console.debug('IndexedDB-promised: DB ugpraded.')
    },
  })

  console.log('IndexedDB-promised: started.')

  return db
}
