import { date } from 'quasar'
import { getIdb } from 'src/idb'
import { TaskRepo, TaskRepoKey } from 'src/services/abstracts/task-repo.service'
import { ServiceBootFn } from 'src/services/service-boot.type'
import { Task } from 'src/typings/task.interface'
import { ref } from 'vue'
import { omit } from 'lodash'
import { IdbTask } from 'src/idb/tasks.idb-store'
import { getMaxDate, getMinDate } from 'src/utils/date.utils'

const getTasks: TaskRepo['getTasks'] = async (startDt: Date, endDt?: Date) => {
  endDt = endDt ?? startDt

  const idb = getIdb()

  const tasks = await idb.getAllFromIndex(
    'tasks',
    'activeMillis',
    IDBKeyRange.bound(
      getMinDate(startDt, endDt).getTime(),
      getMaxDate(startDt, endDt).getTime()
    )
  )

  return tasks.map((t) => omit(t, '$activeDates'))
}

const getDaysWithTasks: TaskRepo['getDaysWithTasks'] = async () =>
  Promise.resolve([])

/**
 * Helper method to prepare the task data for IDB storage.
 * Mainly concerned with the `$activeDates` attribute.
 *
 * This is exported for unit testing purposes.
 *
 * @param task
 * @returns
 */
export function prepareTaskForIdb(task: Task): IdbTask {
  const activeMillis: number[] = []

  const { dueDt, carryOverUntil, completeDt } = task

  // TODO ensure that getDateDiff is inclusive
  const daysBetween = date.getDateDiff(
    // TODO add comment why we do this
    completeDt && completeDt <= carryOverUntil ? completeDt : carryOverUntil,
    dueDt
  )

  for (let daysToAdd = 0; daysToAdd <= daysBetween; daysToAdd++) {
    activeMillis.push(date.addToDate(dueDt, { days: daysToAdd }).getTime())
  }

  return {
    ...task,
    $activeMillis: activeMillis,
  }
}

const lastWriteRef = ref(new Date())
/**
 * This needs to be called once we've got IDB access.
 * This reads the lastWriteDt for the tasks store from the IDB and then
 * uses that as the value of `lastWriteRef`.
 */
async function initLastWrite() {
  const idb = getIdb()
  const data = await idb.get('lastWrite', 'tasks')
  lastWriteRef.value = data?.lastWriteDt ?? new Date()
}

const insert: TaskRepo['insert'] = async (task: Task) => {
  const idb = getIdb()
  const tx = idb.transaction(['tasks', 'lastWrite'], 'readwrite')

  try {
    const idbTask = prepareTaskForIdb(task)
    await tx.objectStore('tasks').put(idbTask)

    const lastWriteDt = new Date()
    await tx.objectStore('lastWrite').put({
      storeName: 'tasks',
      lastWriteDt,
    })
    lastWriteRef.value = lastWriteDt

    tx.commit()
  } catch (e) {
    const err = e as Error
    console.warn(
      'TaskRepoImpl: error encountered while inserting: %s',
      err.message ?? 'NO_ERR_MESSAGE'
    )
    tx.abort()
    throw err
  }
}

const remove: TaskRepo['remove'] = async (taskId) => {
  const idb = getIdb()
  const tx = idb.transaction(['lastWrite', 'tasks'], 'readwrite')

  try {
    const tasksStore = tx.objectStore('tasks')

    const task = await tasksStore.get(taskId)
    if (!task) {
      throw new Error(`Task ${taskId} does not exist!`)
    }
    await tx.objectStore('tasks').delete(taskId)

    const lastWriteDt = new Date()
    await tx.objectStore('lastWrite').put({
      storeName: 'tasks',
      lastWriteDt,
    })
    lastWriteRef.value = lastWriteDt

    tx.commit()
  } catch (e) {
    const err = e as Error
    console.warn(
      'TaskRepoImpl: error encountered while removing %s: %s',
      taskId,
      err.message ?? 'NO_ERR_MESSAGE'
    )
    tx.abort()
    throw err
  }
}

const boot: ServiceBootFn = async ({ app }) => {
  await initLastWrite()
  app.provide(TaskRepoKey, {
    getDaysWithTasks,
    getTasks,
    insert,
    lastWrite: lastWriteRef,
    remove,
  })

  console.debug('TaskRepoImpl: provided.')
}
export default boot
