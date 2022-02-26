import { openDB } from 'idb'
import { TasksIdbStore } from 'src/idb/tasks.idb-store'

const DB_NAME = 'todo.idb'
// TODO update this per schema change
const DB_VERSION = 1

type Schema = TasksIdbStore
import tasksUpgradeCb from './tasks.idb-store'

export async function start() {
  return await openDB<Schema>(DB_NAME, DB_VERSION, {
    upgrade(...args) {
      tasksUpgradeCb(...args)
    },
  })
}
