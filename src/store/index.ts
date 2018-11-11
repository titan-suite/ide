import Vue from 'vue'
import Vuex from 'vuex'
import workspace from './modules/workspace'
import { compile, run } from './modules/sidebar/index'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    workspace,
    compile,
    run
  }
})
