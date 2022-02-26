import { date } from 'quasar'
import { IdbTask } from 'src/idb/tasks.idb-store'
import { TaskRepo } from 'src/services/abstracts/task-repo.service'
import { useIdb } from 'src/services/idb.service'

const BACKTRACK_LIMIT = 100

export const getTasks: TaskRepo['getTasks'] = async (snapshotDate: Date) => {
  const startOfDay = date.startOfDate(snapshotDate, 'day')
  const idb = useIdb()

  const alreadyProcessed = new Set<string>()
  // TODO remove the use of IdbTask
  const snapshotTasks: IdbTask[] = []

  for (
    let daysToSubtract = 0;
    daysToSubtract <= BACKTRACK_LIMIT;
    daysToSubtract++
  ) {
    const subtracted = date.subtractFromDate(startOfDay, {
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
        // due has lapsed
        item.dueDt < startOfDay &&
        // carry over is still in effect
        item.carryOverUntil > startOfDay &&
        // not yet completed, or it was completed after the snapshot
        (!item.completeDt || item.completeDt >= startOfDay)
      ) {
        snapshotTasks.push(item)
      }

      alreadyProcessed.add(item.id)
    }
  }

  return snapshotTasks
}
