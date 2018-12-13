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
      ? [
          createPersistedState({
            reducer: persistedState => {
              const Run = { ...persistedState.run }
              const Compile = { ...persistedState.compile }
              delete Compile.solVersions
              delete Run.isProviderSet
              delete Run.providerInstance
              delete Run.privateKey
              delete Run.isPrivateKeySet
              delete Run.deployedContracts
              delete Run.accountsLoading
              delete Run.receipts
              return { ...persistedState, run: Run, compile: Compile }
            },
          }),
        ]
      : undefined,
  modules: {
    workspace,
    compile,
    run,
  },
}
export default new Vuex.Store<RootState>(store)
