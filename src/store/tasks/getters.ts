import { GetterTree } from 'vuex'
import { StateInterface } from '../index'
import { ITasksState } from './state'

const getters: GetterTree<ITasksState, StateInterface> = {
  someAction(/* context */) {
    // your code
  },
}

export default getters
