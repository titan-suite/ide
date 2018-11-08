import Vue from 'vue'
import Vuex from 'vuex'
import workspace from './modules/workspace'
import sidebar from './modules/sidebar'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    workspace,
    sidebar
  }
})
