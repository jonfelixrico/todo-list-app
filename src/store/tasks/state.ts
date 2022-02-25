import { Task } from 'src/typings/task.interface'

export interface ITasksState {
  tasks: Task[]
}

function state(): ITasksState {
  return {
    tasks: [],
  }
}

export default state
