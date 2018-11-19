import Vue from 'vue'
import Vuex, { StoreOptions } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import workspace from './modules/workspace'
import compile from './modules/sidebar/compile'
import run from './modules/sidebar/run'
import { RootState } from './types'
Vue.use(Vuex)

const store: StoreOptions<RootState> = {
  plugins:
    process.env.NODE_ENV === 'production'
      ? [createPersistedState()]
      : undefined,
  modules: {
    workspace,
    compile,
    run
  }
}
export default new Vuex.Store<RootState>(store)
