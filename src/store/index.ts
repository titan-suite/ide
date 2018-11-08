import Vue from 'vue'
import Vuex from 'vuex'
import editor from './modules/editor'
import sidebar from './modules/sidebar'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    editor,
    sidebar
  }
})
