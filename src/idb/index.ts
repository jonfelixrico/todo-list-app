import { openDB } from 'idb'
import { TasksIdbStore } from 'src/idb/tasks.idb-store'

const DB_NAME = 'todo.idb'
// TODO update this per schema change
const DB_VERSION = 1

export type IdbSchema = TasksIdbStore
import tasksUpgradeCb from './tasks.idb-store'

export async function start() {
  const db = await openDB<IdbSchema>(DB_NAME, DB_VERSION, {
    upgrade(...args) {
      tasksUpgradeCb(...args)
      console.debug('IndexedDB-promised: DB ugpraded.')
    },
  })

  console.log('IndexedDB-promised: started.')

  return db
}
