import { DateTime } from 'luxon'
import { Task } from 'src/typings/task.interface'
import { inject, InjectionKey, Ref } from 'vue'

export interface TaskRepo {
  getTasks(snapshotDate: DateTime): Promise<Task[]>
  getTasks(startDt: DateTime, endDt: DateTime): Promise<Task[]>
  getTasks(startDt: DateTime, endDt?: DateTime): Promise<Task[]>

  lastWrite: Ref<DateTime>
  getDaysWithTasks: () => Promise<DateTime[]>
  insert: (task: Task) => Promise<void>
  remove: (taskId: string) => Promise<void>
}

export const TaskRepoKey: InjectionKey<TaskRepo> = Symbol('task repo')

export function useTaskRepo() {
  return inject(TaskRepoKey) as TaskRepo
}
