import { IDBPDatabase } from 'idb'
import { IdbSchema, start } from 'src/idb'
import { App, inject, InjectionKey } from 'vue'
import { ServiceBootFn } from './service-boot.type'

export const IdbServiceKey: InjectionKey<IDBPDatabase<IdbSchema>> =
  Symbol('idb')

export function useIdb() {
  return inject(IdbServiceKey)
}

const boot: ServiceBootFn = async ({ app }: { app: App }) => {
  const db = await start()
  app.provide(IdbServiceKey, db)
  console.debug('IdbService: provided.')
}
export default boot
