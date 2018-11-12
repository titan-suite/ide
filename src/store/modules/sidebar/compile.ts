import { ActionTree, MutationTree, GetterTree } from 'vuex'
import { CompileState, RootState, CompiledCode } from '../../types'
import Web3, { compile } from '@titan-suite/core/aion'
import { ContractAbi as TypeContractAbi } from 'ethereum-types'
import { parse } from 'typechain/dist/parser/abiParser'

let nodeAddress = ''
if (process.env.NODE_ENV !== 'production') {
  nodeAddress = require('../../titanrc').nodeAddress
}
const compileState: CompileState = {
  compiledCode: {},
  solVersions: [
    {
      value: '0.4.9',
      label: '0.4.9'
    },
    {
      value: '0.4.15',
      label: '0.4.15'
    }
  ],
  contracts: {},
  nodeAddress,
  selectedContract: '',
  selectedSolVersion: '0.4.9',
  isConnectedToNode: false
}

export type ContractNames = string[]
export type ContractByteCode = (contractName?: string) => string
export type ContractAbi = (contractName?: string) => TypeContractAbi
export type ContractDetails = (contractName?: string) => CompiledCode

const compileGetters: GetterTree<CompileState, RootState> = {
  contractNames(state): ContractNames {
    const contractNames = Object.keys(state.compiledCode)
    return contractNames
  },
  contractByteCode(state): ContractByteCode {
    return (contractName = state.selectedContract) =>
      state.compiledCode[contractName].code
  },
  contractAbi(state): ContractAbi {
    return (contractName = state.selectedContract) =>
      state.compiledCode[contractName].info.abiDefinition
  },
  contractDetails(state): ContractDetails {
    return (contractName = state.selectedContract) =>
      state.compiledCode[contractName]
  }
}

const compileMutations: MutationTree<CompileState> = {
  saveCompiledCode(state, payload) {
    state.compiledCode = payload
  },
  saveContract(state, { name, data }) {
    state.contracts = { ...state.contracts, [name]: data }
  },
  saveNodeAddress(state, payload) {
    state.nodeAddress = payload
  },
  setNodeStatus(state, status: boolean) {
    state.isConnectedToNode = status
  },
  setSolVersion(state, payload) {
    state.selectedSolVersion = payload
  },
  setSelectedContract(state, payload) {
    state.selectedContract = payload
  }
}

const compileActions: ActionTree<CompileState, RootState> = {
  async compile({ state, rootState, commit, dispatch, getters, rootGetters }) {
    const contract = rootGetters['workspace/activeFileCode']
    try {
      const web3 = new Web3(new Web3.providers.HttpProvider(state.nodeAddress))
      const contracts = await compile({
        contract,
        web3
      })
      commit('saveCompiledCode', contracts)
      for (const [
        contractName,
        {
          info: { abiDefinition }
        }
      ] of Object.entries(contracts)) {
        commit('saveContract', {
          name: contractName,
          data: parse(abiDefinition, contractName)
        })
      }
      commit('setNodeStatus', true)
      commit('setSelectedContract', Object.keys(contracts)[0])
    } catch (error) {
      throw error
    }
  }
}

export default {
  namespaced: true,
  state: compileState,
  getters: compileGetters,
  mutations: compileMutations,
  actions: compileActions
}
