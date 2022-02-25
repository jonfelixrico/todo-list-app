import { date, uid } from 'quasar'
import { Task } from 'src/typings/task.interface'
import { ActionTree } from 'vuex'
import { StateInterface } from '../index'
import { ITasksState } from './state'

export interface TaskToCreate {
  title: string
  notes: string | null
  priority: number
}

const actions: ActionTree<ITasksState, StateInterface> = {
  createTask({ commit }, toCreate: TaskToCreate) {
    const createDt = new Date()

    const task: Task = {
      ...toCreate,
      createDt,
      lastUpdateDt: createDt,
      targetDt: date.startOfDate(createDt, 'day'),
      id: uid(),
    }

    commit('addTask', task)

    return task
  },
}

export default actions
