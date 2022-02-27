import { IDBPDatabase } from 'idb'
import { start } from 'src/idb'
import { IdbSchema } from 'src/idb/idb.schema'
import { App, inject, InjectionKey } from 'vue'
import { ServiceBootFn } from './service-boot.type'

export const IdbServiceKey: InjectionKey<IDBPDatabase<IdbSchema>> =
  Symbol('idb')

export function useIdb() {
  return inject(IdbServiceKey) as IDBPDatabase<IdbSchema>
}

const boot: ServiceBootFn = async ({ app }: { app: App }) => {
  const db = await start()
  app.provide(IdbServiceKey, db)
  console.debug('IdbService: provided.')
}
export default boot
