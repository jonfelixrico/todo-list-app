import { boot } from 'quasar/wrappers'
import taskRepoImpl from 'src/services/impl/task-repo.service.impl'

export default boot(async (bootArgs) => {
  await taskRepoImpl(bootArgs)
})
