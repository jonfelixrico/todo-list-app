import { Task } from 'src/typings/task.interface'
import { MutationTree } from 'vuex'
import { ITasksState } from './state'

const mutation: MutationTree<ITasksState> = {
  addTask({ tasks }, task: Task) {
    tasks.push(task)
  },
}

export default mutation
