import { IDBPDatabase, openDB } from 'idb'
import tasksUpgradeCb from './tasks.idb-store'
import lastWriteUpgradeCb from './last-write.idb-store'
import { IdbSchema, IdbUgpradeCb } from 'src/idb/idb.schema'

const DB_NAME = 'todo.idb'
// TODO update this per schema change
const DB_VERSION = 2

let idb: IDBPDatabase<IdbSchema>

const upgradeCbs: IdbUgpradeCb[] = [tasksUpgradeCb, lastWriteUpgradeCb]

export async function start() {
  idb = await openDB<IdbSchema>(DB_NAME, DB_VERSION, {
    upgrade(...args) {
      for (const cb of upgradeCbs) {
        cb(...args)
      }

      console.debug('IndexedDB-promised: DB ugpraded.')
    },
  })

  console.log('IndexedDB-promised: started.')

  return idb
}

export function getIdb() {
  return idb
}
