import { ActionTree, MutationTree, GetterTree } from 'vuex'
import { CompileState, RootState, CompiledCode } from '../../types'
import { ContractAbi as TypeContractAbi } from 'ethereum-types'
import { extractConstructor } from '../../../utils'

const compileState: CompileState = {
  compiledCode: {},
  solVersions: [
    {
      value: '0.4.9',
      label: '0.4.9'
    }
  ],
  contracts: {},
  selectedContract: '',
  selectedSolVersion: '0.4.9',
}

export type ContractNames = string[]
export type ContractByteCode = (contractName?: string) => string
export type ContractAbi = (contractName?: string) => TypeContractAbi
export type ContractDetails = (contractName?: string) => CompiledCode
export type ParsedContractConstructor = (
  contractName?: string
) => string | undefined

const compileGetters: GetterTree<CompileState, RootState> = {
  contractNames(state): ContractNames {
    const contractNames = Object.keys(state.compiledCode)
    return contractNames
  },
  contractAbi(state): ContractAbi {
    return (contractName = state.selectedContract) =>
      state.compiledCode[contractName].info.abiDefinition
  },
  contractDetails(state): ContractDetails {
    return (contractName = state.selectedContract) =>
      state.compiledCode[contractName]
  },
  parsedContractConstructor(state): ParsedContractConstructor {
    return (contractName = state.selectedContract) => {
      return contractName in state.contracts
        ? state.contracts[contractName]
        : undefined
    }
  }
}

const compileMutations: MutationTree<CompileState> = {
  saveCompiledCode(state, payload) {
    state.compiledCode = payload
  },
  saveConstructor(state, { name, data }) {
    state.contracts = { ...state.contracts, [name]: data }
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
    // const contract = rootGetters['workspace/activeFile'].code
    // const web3 = new Web3(new Web3.providers.HttpProvider(state.nodeAddress))
    // const contracts = await compile(
    //   {
    //     contract
    //   },
    //   web3
    // )
    // commit('saveCompiledCode', contracts)
    // for (const [
    //   contractName,
    //   {
    //     info: { abiDefinition }
    //   }
    // ] of Object.entries(contracts)) {
    //   commit('saveConstructor', {
    //     name: contractName,
    //     data: extractConstructor(abiDefinition)
    //   })
    // }
  }
}

export default {
  namespaced: true,
  state: compileState,
  getters: compileGetters,
  mutations: compileMutations,
  actions: compileActions
}
