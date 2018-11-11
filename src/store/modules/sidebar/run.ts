import { ActionTree, MutationTree, GetterTree } from 'vuex'
import { RunState, RootState } from '../../types'
import Web3, { deploy } from '../../../../@titan-suite/core/aion/dist'
import { nodeAddress } from '../../titanrc'
const runState: RunState = {
  // environment: [
  //  { name: 'Web3 Provider', endpoint: ''},
  // ],
  accounts: [],
  gasLimit: 69,
  value: {
    amount: 0,
    unit: 'wei'
  },
  txDetails: {}
}

const runGetters: GetterTree<RunState, RootState> = {
  txReceipt(state): any {
    return state.txDetails
  }
}

const runMutations: MutationTree<RunState> = {
  saveDeployedCode(state, payload) {
    state.txDetails = payload
  }
}

const runActions: ActionTree<RunState, RootState> = {
  async deploy({ state, rootState, commit, dispatch, getters, rootGetters }) {
    const code =
      rootState.workspace.workspaces[rootState.workspace.activeWorkspaceIndex]
        .projectTree.folders[0].files[0].code
    try {
      const web3 = new Web3(new Web3.providers.HttpProvider(nodeAddress))
      console.log({ web3 })
      commit('deployMutations', {})
    } catch (error) {
      console.log(error)
      throw error
    }
  },
  async getAccounts({
    state,
    rootState,
    commit,
    dispatch,
    getters,
    rootGetters
  }) {
    const code =
      rootState.workspace.workspaces[rootState.workspace.activeWorkspaceIndex]
        .projectTree.folders[0].files[0].code
    try {
      const web3 = new Web3(new Web3.providers.HttpProvider(nodeAddress))
      console.log({ web3 })
      commit('deployMutations', {})
    } catch (error) {
      console.log(error)
      throw error
    }
  }
}

export default {
  namespaced: true,
  state: runState,
  getters: runGetters,
  mutations: runMutations,
  actions: runActions
}
