import { date } from 'quasar'
import { TaskRepo } from 'src/services/abstracts/task-repo.service'
import { useIdb } from 'src/services/idb.service'
import { Task } from 'src/typings/task.interface'

const BACKTRACK_LIMIT = 100

export const getTasks: TaskRepo['getTasks'] = async (snapshotDt: Date) => {
  const startOfSnapshotDt = date.startOfDate(snapshotDt, 'day')
  const idb = useIdb()

  const alreadyProcessed = new Set<string>()
  const snapshotTasks: Task[] = []

  for (
    let daysToSubtract = 0;
    daysToSubtract <= BACKTRACK_LIMIT;
    daysToSubtract++
  ) {
    const subtracted = date.subtractFromDate(startOfSnapshotDt, {
      day: daysToSubtract,
    })

    const items = await idb.getAllFromIndex(
      'tasks',
      'referenceDates',
      subtracted
    )

    for (const item of items) {
      if (alreadyProcessed.has(item.id)) {
        continue
      }

      if (
        // due has lapsed or is due on the day
        item.dueDt <= startOfSnapshotDt &&
        // carry over is still in effect
        item.carryOverUntil >= startOfSnapshotDt &&
        // not yet completed, or it was completed on or after the snapshot
        (!item.completeDt || item.completeDt >= startOfSnapshotDt)
      ) {
        snapshotTasks.push(item)
      }

      alreadyProcessed.add(item.id)
    }
  }

  return snapshotTasks
}

export const getDaysWithTasks: TaskRepo['getDaysWithTasks'] = async () => {
  const idb = useIdb()
  const daysWithTasks = await idb.getAll('daysWithTasks')
  return daysWithTasks.map(({ date }) => date).sort()
}

export const insert: TaskRepo['insert'] = async (task: Task) => {
  const idb = useIdb()
  const tx = idb.transaction(['daysWithTasks', 'tasks'], 'readwrite')

  try {
    await tx.objectStore('tasks').put(task)

    const dwt = tx.objectStore('daysWithTasks')
    const { dueDt } = task
    const dwtEntry = await dwt.get(dueDt)

    await dwt.put({
      date: dueDt,
      count: dwtEntry ? dwtEntry.count + 1 : 1,
    })

    tx.commit()
  } catch (e) {
    const err = e as Error
    console.warn(
      'TaskRepoImpl: error encountered while inserting: %s',
      err.message ?? 'NO_ERR_MESSAGE'
    )
    tx.abort()
  }
}
