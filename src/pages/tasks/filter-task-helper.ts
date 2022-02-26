import { useStore } from 'src/store'
import { Task } from 'src/typings/task.interface'
import { computed, Ref } from 'vue'

function shouldCarryOver(
  { carryOverUntil, completeDt }: Task,
  referenceDt: Date
): boolean {
  if (!carryOverUntil) {
    return false
  } else if (carryOverUntil === 'INDEFINITE') {
    if (!completeDt) {
      return true // not yet completed
    } else if (completeDt && completeDt >= referenceDt) {
      return true // completed on or after the referenceDt
    } else {
      // completeDt && completeDt < referenceDt
      // completed before the reference date
      return false
    }
  } else if (carryOverUntil instanceof Date && referenceDt <= carryOverUntil) {
    if (!completeDt) {
      return true // not yet completed
    }
    if (completeDt && completeDt >= referenceDt) {
      return true // completed, but lapsed the referenceDt
    } else {
      return false // completed, but before the referenceDt
    }
  }

  return false
}

const sortByDueDt = (a: Task, b: Task) => {
  // sort from oldest target to newest target
  const targetDiff = a.dueDt.getTime() - b.dueDt.getTime()
  if (targetDiff !== 0) {
    return targetDiff
  }

  // sort from most priority to least priority
  return b.priority - a.priority
}

export interface TasksGroupedByDueDt {
  tasks: Task[]
  dueDt: Date
}

export function useTaskFilter(dueDt: Ref<Date>) {
  const store = useStore()

  /**
   * Includes tasks which matches the provided `dueDt`.
   */
  const inTarget = computed(() => {
    return (
      store.state.tasks.tasks
        /*
         * NOTE cannot use dueDt.value === task.dueDt here since it will be a reference check
         * instead of equality check.
         */
        .filter((task) => dueDt.value.getTime() === task.dueDt.getTime())
        .sort(sortByDueDt)
    )
  })

  /**
   * Includes tasks which are created before the `dueDt`,
   * and are eligible for carry-over.
   */
  const carriedOver = computed(() => {
    return store.state.tasks.tasks
      .filter((task) => {
        const madeBeforeDueDt = task.dueDt < dueDt.value
        return madeBeforeDueDt && shouldCarryOver(task, dueDt.value)
      })
      .sort(sortByDueDt)
  })

  /**
   * List of tasks grouped by the same dueDt.
   * These groups are sorted from earliest (made way before) to most recent (most recent would
   * be tasks with matching `dueDt`).
   *
   * A group has sorted its tasks from highest priority to lowest priority (prio 10 to prio 0).
   */
  return computed(() => {
    const mergedTasks = inTarget.value.concat(carriedOver.value)
    const groupedUp: TasksGroupedByDueDt[] = []

    for (const task of mergedTasks) {
      const last = groupedUp[groupedUp.length - 1]
      if (!last || last.dueDt !== task.dueDt) {
        groupedUp.push({
          tasks: [task],
          dueDt: task.dueDt,
        })
      } else {
        last.tasks.push(task)
      }
    }

    return groupedUp
  })
}
