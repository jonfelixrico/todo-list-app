import { boot } from 'quasar/wrappers'
import { startIdb } from 'src/service-abstracts/idb.service'

export default boot(async ({ app }) => {
  await startIdb(app)
})
