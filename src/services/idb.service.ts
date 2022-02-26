import { IDBPDatabase, openDB } from 'idb'
import { App, inject, InjectionKey } from 'vue'

const DB_NAME = 'todo.idb'
// TODO update this per schema change
const DB_VERSION = 1

export const IdbServiceKey: InjectionKey<IDBPDatabase> = Symbol('idb')

export async function startIdb(app: App) {
  const db = await openDB(DB_NAME, DB_VERSION)
  console.log('IndexedDB-promised: started.')
  app.provide(IdbServiceKey, db)
}

export default startIdb

export function useIdb() {
  return inject(IdbServiceKey)
}
