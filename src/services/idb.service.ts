import { IDBPDatabase, openDB } from 'idb'
import { App, inject, InjectionKey } from 'vue'

const DB_NAME = 'todo.idb'
// TODO update this per schema change
const DB_VERSION = 1

export const IdbServiceKey: InjectionKey<IDBPDatabase> = Symbol('idb')

export default async ({ app }: { app: App }) => {
  const db = await openDB(DB_NAME, DB_VERSION)
  app.provide(IdbServiceKey, db)
  console.log('IndexedDB-promised: started and provided.')
}

export function useIdb() {
  return inject(IdbServiceKey)
}
