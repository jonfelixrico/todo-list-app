import { date } from 'quasar'
import { useTasksFetcher } from 'src/hooks/task.hooks'
import { Task } from 'src/typings/task.interface'
import { computed, Ref } from 'vue'

function doSorting(a: Task, b: Task) {
  // sort from due dt, ascending
  const dueDtDiff = a.dueDt.getTime() - b.dueDt.getTime()
  if (!dueDtDiff) {
    return dueDtDiff
  }

  // sort by priority, descending
  const prioDiff = b.priority - a.priority
  if (!prioDiff) {
    return prioDiff
  }

  // sort by create dt, ascending
  return a.createDt.getTime() - b.createDt.getTime()
}

interface TaskGroup {
  date: Date
  tasks: Task[]
}

function doGrouping(tasks: Task[]): TaskGroup[] {
  const sorted = [...tasks].sort(doSorting)

  const groups: TaskGroup[] = []
  for (const task of sorted) {
    const last = groups[groups.length - 1]
    if (!last || !date.isSameDate(task.dueDt, last.date)) {
      groups.push({
        date: task.dueDt,
        tasks: [task],
      })
      continue
    }

    last.tasks.push(task)
  }

  return groups
}

export function useFilteredTaskList(snapshotDt: Ref<Date>) {
  const { tasks, isLoading } = useTasksFetcher(snapshotDt)

  return {
    tasks: computed(() => doGrouping(tasks.value)),
    isLoading,
  }
}
