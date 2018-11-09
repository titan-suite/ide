import { ActionTree, MutationTree, GetterTree } from 'vuex'
import { SidebarState, RootState } from '../types'
import Web3, { compile } from '../../../@titan-suite/core/aion'
import { nodeAddress } from '../titanrc'
const sideBarState: SidebarState = {
  compiledCode: ''
}

const sideBarGetters: GetterTree<SidebarState, RootState> = {
  abi(state): any {
    return state.compiledCode
  }
}

const sideBarMutations: MutationTree<SidebarState> = {
  saveCompiledCode(state, payload: string) {
    state.compiledCode = payload
  }
}

const sideBarActions: ActionTree<SidebarState, RootState> = {
  async compile({ state, rootState, commit, dispatch, getters, rootGetters }) {
    const code = rootState.workspace.workSpaces[rootState.workspace.activeWorkSpaceIndex].activeFile.code
    try {
      const web3 = new Web3(new Web3.providers.HttpProvider(nodeAddress))
      console.log({ web3 })
      const contracts = await compile({
        contract: `pragma solidity ^0.4.9;


contract Example {

    uint128 public num = 5;
    event NumChanged (uint128);

    function add(uint128 a) public returns (uint128) {
        return num+a;
    }

    function setA(uint128 a) public {
        num = a;
        NumChanged(num);
    }
}`,
        web3
      })
      console.log({ data: contracts })
      commit('saveCompiledCode', contracts)
    } catch (error) {
      console.log(error)
      throw error
    }
  }
}

const sidebar = {
  namespaced: true,
  state: sideBarState,
  getters: sideBarGetters,
  mutations: sideBarMutations,
  actions: sideBarActions
}

export default sidebar
