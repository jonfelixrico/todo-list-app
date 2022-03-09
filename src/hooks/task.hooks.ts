import { DateTime } from 'luxon'
import { uid } from 'quasar'
import { useTaskRepo } from 'src/services/abstracts/task-repo.service'
import { DraftTaskData, Task } from 'src/typings/task.interface'
import { computed, ref, Ref, watch } from 'vue'

export function useTasksFetcher(date: Ref<DateTime>) {
  const { getTasks, lastWrite } = useTaskRepo()
  const data = ref<Task[]>([])
  const loadingJob = ref<string | null>(null)

  watch(
    [lastWrite, date],
    async () => {
      const jobId = (loadingJob.value = uid())
      try {
        console.debug('useTasksFetcher: getting tasks for %s.', date.value)
        const res = await getTasks(date.value)
        if (loadingJob.value === jobId) {
          data.value = res
          console.debug('useTasksFetcher: retrieved %d records.', res.length)
        } else {
          console.debug(
            'useTasksFetcher: retrieved %d records, but not published to the ref.',
            res.length
          )
        }
      } finally {
        if (jobId === loadingJob.value) {
          loadingJob.value = null
        }
      }
    },
    {
      immediate: true,
    }
  )

  return {
    tasks: data,
    isLoading: computed(() => !!loadingJob.value),
  }
}

export function useCreateTask() {
  const repo = useTaskRepo()

  return async (toCreate: DraftTaskData) => {
    const createDt = DateTime.now()
    const task: Task = {
      ...toCreate,
      createDt,
      lastUpdateDt: createDt,
      completeDt: null,
      id: uid(),
    }

    await repo.insert(task)
    return task
  }
}

export function useRemoveTask() {
  const repo = useTaskRepo()

  return async (taskId: string) => await repo.remove(taskId)
}
