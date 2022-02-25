import { date, uid } from 'quasar'
import { Task, TaskDraft } from 'src/typings/task.interface'
import { ActionTree } from 'vuex'
import { StateInterface } from '../index'
import { ITasksState } from './state'

const actions: ActionTree<ITasksState, StateInterface> = {
  createTask({ commit }, draft: TaskDraft) {
    const createDt = new Date()

    const task: Task = {
      ...draft,
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
