import { useTaskRepo } from 'src/services/abstracts/task-repo.service'
import { Task } from 'src/typings/task.interface'
import { ref, Ref, watch } from 'vue'

export function useTasksFetcher(date: Ref<Date>) {
  const { getTasks, lastWrite } = useTaskRepo()
  const data = ref<Task[]>([])

  watch(
    [lastWrite, date],
    async () => {
      console.debug('useTasksFetcher: getting tasks for %s.', date.value)
      const res = (data.value = await getTasks(date.value))
      console.debug('useTasksFetcher: retrieved %d records.', res.length)
    },
    {
      immediate: true,
    }
  )

  return data
}
