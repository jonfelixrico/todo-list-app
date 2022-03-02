import { IDBPDatabase, openDB } from 'idb'
import tasksUpgradeCb from './tasks.idb-store'
import keyvalUpgradeCb from './keyval.idb-store'
import daysWithTasksUpgradeCb from './days-with-tasks.idb-store'
import lastWriteUpgradeCb from './last-write.idb-store'
import { IdbSchema } from 'src/idb/idb.schema'

const DB_NAME = 'todo.idb'
// TODO update this per schema change
const DB_VERSION = 1

let idb: IDBPDatabase<IdbSchema>

export async function start() {
  idb = await openDB<IdbSchema>(DB_NAME, DB_VERSION, {
    upgrade(...args) {
      tasksUpgradeCb(...args)
      keyvalUpgradeCb(...args)
      daysWithTasksUpgradeCb(...args)
      lastWriteUpgradeCb(...args)

      console.debug('IndexedDB-promised: DB ugpraded.')
    },
  })

  console.log('IndexedDB-promised: started.')

  return idb
}

export function getIdb() {
  return idb
}
