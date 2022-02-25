import { uid } from 'quasar'
import { EditableTaskAttrs, Task } from 'src/typings/task.interface'
import { ActionTree } from 'vuex'
import { StateInterface } from '../index'
import { ITasksState } from './state'

const actions: ActionTree<ITasksState, StateInterface> = {
  createTask({ commit }, toCreate: EditableTaskAttrs) {
    const createDt = new Date()

    const task: Task = {
      ...toCreate,
      createDt,
      lastUpdateDt: createDt,
      id: uid(),
    }

    commit('addTask', task)

    return task
  },
}

export default actions
