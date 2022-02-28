import { uid, useQuasar } from 'quasar'
import { useTaskRepo } from 'src/services/abstracts/task-repo.service'
import { DraftTaskData, Task } from 'src/typings/task.interface'
import { computed, ref, Ref, watch } from 'vue'

export function useTasksFetcher(date: Ref<Date>) {
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

export function useDateWithTasksFetcher() {
  const { getDaysWithTasks, lastWrite } = useTaskRepo()
  const { loading } = useQuasar()
  const data = ref<Date[]>([])

  watch(
    lastWrite,
    async () => {
      try {
        loading.show()
        data.value = data.value = await getDaysWithTasks()
      } finally {
        loading.hide()
      }
    },
    {
      immediate: true,
    }
  )

  return data
}

export function useCreateTask() {
  const repo = useTaskRepo()

  return async (toCreate: DraftTaskData) => {
    const createDt = new Date()
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
