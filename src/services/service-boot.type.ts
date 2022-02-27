import { App } from 'vue'

type PartialBoot = { app: App }
export type ServiceBootFn = (param: PartialBoot) => Promise<void> | void
