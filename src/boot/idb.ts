import { boot } from 'quasar/wrappers'
import { startIdb } from 'src/services/idb.service'

export default boot(async ({ app }) => {
  await startIdb(app)
})
