import { Task } from 'src/typings/task.interface'
import { inject, InjectionKey, Ref } from 'vue'

export interface TaskRepoService {
  getTasks: (snapshotDate: Date) => Promise<Task[]>
  lastWrite: Ref<number>
  getDaysWithTasks: () => Promise<Date[]>
}

export const TaskRepoServiceKey: InjectionKey<TaskRepoService> =
  Symbol('task crud service')

export function useTaskRepoService() {
  return inject(TaskRepoServiceKey)
}
