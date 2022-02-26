import { uid } from 'quasar'
import { DraftTaskData, Task } from 'src/typings/task.interface'
import { ActionTree } from 'vuex'
import { StateInterface } from '../index'
import { ITasksState } from './state'

export type CreateTaskInput = DraftTaskData

const actions: ActionTree<ITasksState, StateInterface> = {
  createTask({ commit }, toCreate: CreateTaskInput) {
    const createDt = new Date()

    const task: Task = {
      ...toCreate,
      createDt,
      lastUpdateDt: createDt,
      completeDt: null,
      id: uid(),
    }

    commit('addTask', task)

    return task
  },
}

export default actions
