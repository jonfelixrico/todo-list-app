import { Task } from 'src/typings/task.interface'
import { inject, InjectionKey, Ref } from 'vue'

export interface TaskRepo {
  getTasks: (snapshotDate: Date) => Promise<Task[]>
  lastWrite: Ref<Date>
  getDaysWithTasks: () => Promise<Date[]>
  insert: (task: Task) => Promise<void>
}

export const TaskRepoKey: InjectionKey<TaskRepo> = Symbol('task repo')

export function useTaskRepo() {
  return inject(TaskRepoKey) as TaskRepo
}
