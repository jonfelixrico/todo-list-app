import { date } from 'quasar'
import { getIdb } from 'src/idb'
import { TaskRepo, TaskRepoKey } from 'src/services/abstracts/task-repo.service'
import { ServiceBootFn } from 'src/services/service-boot.type'
import { Task } from 'src/typings/task.interface'
import { ref } from 'vue'
import { omit } from 'lodash'
import { IdbTask } from 'src/idb/tasks.idb-store'

const getTasks: TaskRepo['getTasks'] = async (startDt: Date, endDt?: Date) => {
  startDt = date.startOfDate(startDt, 'day')
  endDt = date.startOfDate(endDt ?? startDt, 'day')

  const idb = getIdb()

  const tasks = await idb.getAllFromIndex(
    'tasks',
    'activeDates',
    IDBKeyRange.bound(startDt, endDt)
  )

  return tasks.map((t) => omit(t, '$activeDates'))
}

const getDaysWithTasks: TaskRepo['getDaysWithTasks'] = async () => {
  return []
}

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
  const $activeDates: Date[] = []

  const { dueDt, carryOverUntil, completeDt } = task

  const daysBetween = date.getDateDiff(
    // TODO ensure that getDateDiff is inclusive
    dueDt,
    // TODO add comment why we do this
    completeDt && completeDt <= carryOverUntil ? completeDt : carryOverUntil
  )

  for (let daysToAdd = 0; daysToAdd <= daysBetween; daysToAdd++) {
    $activeDates.push(date.addToDate(dueDt, { days: daysToAdd }))
  }

  return {
    ...task,
    $activeDates,
  }
}

const KEYVAL_KEY_FOR_TASK_LAST_WRITE = 'tasksLastWrite'

const lastWriteRef = ref(new Date())
async function initLastWrite() {
  const idb = getIdb()
  const fromDb = await idb.get('keyVal', KEYVAL_KEY_FOR_TASK_LAST_WRITE)
  const lastWrite =
    fromDb && date.isValid(fromDb) ? new Date(fromDb) : new Date()
  lastWriteRef.value = lastWrite
}

const insert: TaskRepo['insert'] = async (task: Task) => {
  const idb = getIdb()
  const tx = idb.transaction(['daysWithTasks', 'tasks', 'keyVal'], 'readwrite')

  try {
    const idbTask = prepareTaskForIdb(task)
    await tx.objectStore('tasks').put(idbTask)

    const dwt = tx.objectStore('daysWithTasks')
    const { dueDt } = task
    const dwtEntry = await dwt.get(dueDt)

    await dwt.put({
      date: dueDt,
      count: dwtEntry ? dwtEntry.count + 1 : 1,
    })

    const lastWrite = new Date()

    await tx
      .objectStore('keyVal')
      .put(lastWrite.toISOString(), KEYVAL_KEY_FOR_TASK_LAST_WRITE)
    lastWriteRef.value = lastWrite

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
  const tx = idb.transaction(['daysWithTasks', 'tasks', 'keyVal'], 'readwrite')

  try {
    const tasksStore = tx.objectStore('tasks')

    const task = await tasksStore.get(taskId)
    if (!task) {
      throw new Error(`Task ${taskId} does not exist!`)
    }

    await tx.objectStore('tasks').delete(taskId)

    const dwt = tx.objectStore('daysWithTasks')
    const { dueDt } = task
    const dwtEntry = await dwt.get(dueDt)

    if (dwtEntry) {
      await dwt.put({
        date: dueDt,
        count: dwtEntry.count - 1,
      })
    } else {
      console.warn(
        'TaskRepoService: daysWithTasks entry for %s is not found',
        dueDt.toISOString()
      )
    }

    const lastWrite = new Date()

    await tx
      .objectStore('keyVal')
      .put(lastWrite.toISOString(), KEYVAL_KEY_FOR_TASK_LAST_WRITE)
    lastWriteRef.value = lastWrite

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
