import Vue from 'vue'
import Vuex, { StoreOptions } from 'vuex'
import workspace from './modules/workspace'
import { compile, run } from './modules/sidebar/index'
import { RootState } from './types'
Vue.use(Vuex)

const store: StoreOptions<RootState> = {
  modules: {
    workspace,
    compile,
    run
  }
}
export default new Vuex.Store<RootState>(store)
