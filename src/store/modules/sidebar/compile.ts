import { ActionTree, MutationTree, GetterTree } from 'vuex'
import { CompileState, RootState } from '../../types'
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
  selectedSolVersion: '0.4.9'
}
export type ContractDetails = (contractName?: string) => any // TODO waiting for Solc pr
export type ParsedContractConstructor = (
  contractName?: string
) => string | undefined

const compileGetters: GetterTree<CompileState, RootState> = {
  contractNames(state): string[] {
    const contractNames = Object.keys(state.compiledCode)
    return contractNames
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
    const contract = rootGetters['workspace/activeFile'].code
    const providerInstance = rootState.run.providerInstance
    if (providerInstance) {
      const contracts: { [key: string]: any } = await providerInstance.compile(
        contract
      )
      if ('compile-error' in contracts) {
        throw new Error(contracts['compile-error'].error)
      }
      commit('saveCompiledCode', contracts)
      for (const [
        contractName,
        {
          info: { abiDefinition }
        }
      ] of Object.entries(contracts)) {
        commit('saveConstructor', {
          name: contractName,
          data: extractConstructor(abiDefinition)
        })
      }
      commit('setSelectedContract', Object.keys(contracts)[0])
    } else {
      throw new Error('Provider not set')
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
