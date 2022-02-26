import { Task } from 'src/typings/task.interface'
import { inject, InjectionKey } from 'vue'

export interface TaskRepoService {
  getTasks: (snapshotDate: Date) => Promise<Task[]>
}

export const TaskRepoServiceKey: InjectionKey<TaskRepoService> =
  Symbol('task crud service')

export function useTaskRepoService() {
  return inject(TaskRepoServiceKey)
}
