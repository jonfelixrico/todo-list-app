import { uid, useQuasar } from 'quasar'
import { useTaskRepo } from 'src/services/abstracts/task-repo.service'
import { DraftTaskData, Task } from 'src/typings/task.interface'
import { ref, Ref, watch } from 'vue'

export function useTasksFetcher(date: Ref<Date>) {
  const { getTasks, lastWrite } = useTaskRepo()
  const { loading } = useQuasar()
  const data = ref<Task[]>([])

  watch(
    [lastWrite, date],
    async () => {
      try {
        loading.show()
        console.debug('useTasksFetcher: getting tasks for %s.', date.value)

        const res = (data.value = await getTasks(date.value))
        console.debug('useTasksFetcher: retrieved %d records.', res.length)
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

export async function createTask(toCreate: DraftTaskData) {
  const createDt = new Date()

  const task: Task = {
    ...toCreate,
    createDt,
    lastUpdateDt: createDt,
    completeDt: null,
    id: uid(),
  }

  const repo = useTaskRepo()
  await repo.insert(task)

  return task
}
