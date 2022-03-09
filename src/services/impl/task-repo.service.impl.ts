import { getIdb } from 'src/idb'
import { TaskRepo, TaskRepoKey } from 'src/services/abstracts/task-repo.service'
import { ServiceBootFn } from 'src/services/service-boot.type'
import { Task } from 'src/typings/task.interface'
import { ref } from 'vue'
import { omit } from 'lodash'
import { IdbTask } from 'src/idb/tasks.idb-store'
import { getDaysBetween } from 'src/utils/date.utils'
import { DateTime } from 'luxon'

function convertFromIdb({
  carryOverUntil,
  completeDt,
  createDt,
  lastUpdateDt,
  dueDt,
  ...others
}: IdbTask): Task {
  return {
    ...omit(others, '$activeMillis'),
    carryOverUntil: DateTime.fromJSDate(carryOverUntil),
    completeDt: completeDt ? DateTime.fromJSDate(completeDt) : null,
    createDt: DateTime.fromJSDate(createDt),
    lastUpdateDt: DateTime.fromJSDate(lastUpdateDt),
    dueDt: DateTime.fromJSDate(dueDt),
  }
}

/**
 * Helper method to prepare the task data for IDB storage.
 * Mainly concerned with the `$activeDates` attribute.
 *
 * @param task
 * @returns
 */
export function convertToIdb({
  carryOverUntil,
  completeDt,
  createDt,
  dueDt,
  lastUpdateDt,
  ...others
}: Task): IdbTask {
  const args = [dueDt, carryOverUntil, completeDt].filter(Boolean) as DateTime[]
  const start = DateTime.min(...args)
  const end = DateTime.max(...args)

  return {
    ...others,
    carryOverUntil: carryOverUntil.toJSDate(),
    completeDt: completeDt ? completeDt.toJSDate() : null,
    createDt: createDt.toJSDate(),
    lastUpdateDt: lastUpdateDt.toJSDate(),
    dueDt: dueDt.toJSDate(),
    $activeMillis: getDaysBetween(start, end).map((d) => d.toMillis()),
  }
}

const getTasks: TaskRepo['getTasks'] = async (
  startDt: DateTime,
  endDt?: DateTime
) => {
  endDt = endDt ?? startDt

  const idb = getIdb()

  const tasks = await idb.getAllFromIndex(
    'tasks',
    'activeMillis',
    IDBKeyRange.bound(
      DateTime.min(startDt, endDt).toMillis(),
      DateTime.max(startDt, endDt).toMillis()
    )
  )

  return tasks.map(convertFromIdb)
}

const getDaysWithTasks: TaskRepo['getDaysWithTasks'] = async () =>
  Promise.resolve([])

const lastWriteRef = ref(DateTime.now())
/**
 * This needs to be called once we've got IDB access.
 * This reads the lastWriteDt for the tasks store from the IDB and then
 * uses that as the value of `lastWriteRef`.
 */
async function initLastWrite() {
  const idb = getIdb()
  const data = await idb.get('lastWrite', 'tasks')
  lastWriteRef.value = data?.lastWriteDt
    ? DateTime.fromJSDate(data.lastWriteDt)
    : DateTime.now()
}

const insert: TaskRepo['insert'] = async (task: Task) => {
  const idb = getIdb()
  const tx = idb.transaction(['tasks', 'lastWrite'], 'readwrite')

  try {
    const idbTask = convertToIdb(task)
    await tx.objectStore('tasks').put(idbTask)

    const lastWriteDt = DateTime.now()
    await tx.objectStore('lastWrite').put({
      storeName: 'tasks',
      lastWriteDt: lastWriteDt.toJSDate(),
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

    const lastWriteDt = DateTime.now()
    await tx.objectStore('lastWrite').put({
      storeName: 'tasks',
      lastWriteDt: lastWriteDt.toJSDate(),
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
