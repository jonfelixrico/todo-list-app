import { useTaskRepo } from 'src/services/abstracts/task-repo.service'
import { Task } from 'src/typings/task.interface'
import { ref, Ref, watch } from 'vue'

export function useFilteredTaskRetrieve(date: Ref<Date>) {
  const { getTasks, lastWrite } = useTaskRepo()
  const data = ref<Task[]>([])

  watch(
    [lastWrite, date],
    async () => {
      data.value = await getTasks(date.value)
    },
    {
      immediate: true,
    }
  )

  return data
}
