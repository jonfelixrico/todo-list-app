import { ActionTree } from 'vuex'
import { StateInterface } from '../index'
import { ITasksState } from './state'

const actions: ActionTree<ITasksState, StateInterface> = {
  someAction(/* context */) {
    // your code
  },
}

export default actions
