import { ActionTree, MutationTree, GetterTree } from 'vuex'
import { DeployState, RootState } from '../../types'
import Web3, { deploy } from '../../../../@titan-suite/core/aion'
import { nodeAddress } from '../../titanrc'
const deployState: DeployState = {
  txDetails: {}
}

const deployGetters: GetterTree<DeployState, RootState> = {
  txReceipt(state): any {
    return state.txDetails
  }
}

const deployMutations: MutationTree<DeployState> = {
  saveDeployedCode(state, payload) {
    state.txDetails = payload
  }
}

const deployActions: ActionTree<DeployState, RootState> = {
  async deploy({ state, rootState, commit, dispatch, getters, rootGetters }) {
    const code = rootState.workspace.workSpaces[rootState.workspace.activeWorkSpaceIndex].activeFile.code
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
  state: deployState,
  getters: deployGetters,
  mutations: deployMutations,
  actions: deployActions
}
