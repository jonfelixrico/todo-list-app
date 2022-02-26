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

const sortByTargetDt = (a: Task, b: Task) => {
  // sort from oldest target to newest target
  const targetDiff = a.targetDt.getTime() - b.targetDt.getTime()
  if (targetDiff !== 0) {
    return targetDiff
  }

  // sort from most priority to least priority
  return b.priority - a.priority
}

export interface TasksGroupedByTargetDt {
  tasks: Task[]
  targetDt: Date
}

export function useTaskFilter(targetDt: Ref<Date>) {
  const store = useStore()

  /**
   * Includes tasks which matches the provided `targetDt`.
   */
  const inTarget = computed(() => {
    return store.state.tasks.tasks
      .filter((task) => targetDt.value === task.targetDt)
      .sort(sortByTargetDt)
  })

  /**
   * Includes tasks which are created before the `targetDt`,
   * and are eligible for carry-over.
   */
  const carriedOver = computed(() => {
    return store.state.tasks.tasks
      .filter((task) => {
        const madeBeforeTargetDt = task.targetDt < targetDt.value
        return madeBeforeTargetDt && shouldCarryOver(task, targetDt.value)
      })
      .sort(sortByTargetDt)
  })

  /**
   * List of tasks grouped by the same targetDt.
   * These groups are sorted from earliest (made way before) to most recent (most recent would
   * be tasks with matching `targetDt`).
   *
   * A group has sorted its tasks from highest priority to lowest priority (prio 10 to prio 0).
   */
  return computed(() => {
    const mergedTasks = inTarget.value.concat(carriedOver.value)
    const groupedUp: TasksGroupedByTargetDt[] = []

    for (const task of mergedTasks) {
      const last = groupedUp[groupedUp.length - 1]
      if (!last || last.targetDt !== task.targetDt) {
        groupedUp.push({
          tasks: [task],
          targetDt: task.targetDt,
        })
      } else {
        last.tasks.push(task)
      }
    }

    return groupedUp
  })
}
