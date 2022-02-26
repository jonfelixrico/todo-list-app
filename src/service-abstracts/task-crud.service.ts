import { Task } from 'src/typings/task.interface'
import { inject, InjectionKey } from 'vue'

export interface TaskCrudService {
  getTasks: (snapshotDate: Date) => Promise<Task[]>
}

export const TaskCrudServiceKey: InjectionKey<TaskCrudService> =
  Symbol('task store service')

export function useTaskCrudService() {
  return inject(TaskCrudServiceKey)
}
