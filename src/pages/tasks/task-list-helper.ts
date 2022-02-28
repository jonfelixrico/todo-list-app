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

export function useFilteredTaskList(snapshotDt: Ref<Date>) {
  const { tasks, isLoading } = useTasksFetcher(snapshotDt)

  return {
    tasks: computed(() => [...tasks.value].sort(doSorting)),
    isLoading,
  }
}
