import { ActionTree, MutationTree, GetterTree } from 'vuex'
import { CompileState, RootState } from '../../types'
import { extractConstructor, BLOCKCHAINS } from '../../../utils'
const compileState: CompileState = {
  compilerType: 'Aion',
  compiledCode: {},
  solVersions: [],
  contracts: {},
  selectedContract: '',
  selectedSolVersion: '',
  useInBrowserCompiler: false,
}
export type ContractDetails = (contractName?: string) => any // TODO waiting for Solc pr
export type ParsedContractConstructor = (contractName?: string) => string | undefined

const compileGetters: GetterTree<CompileState, RootState> = {
  contractNames(state): string[] {
    const contractNames = Object.keys(state.compiledCode)
    return contractNames
  },
  contractDetails(state): ContractDetails {
    return (contractName = state.selectedContract) => state.compiledCode[contractName]
  },
  parsedContractConstructor(state): ParsedContractConstructor {
    return (contractName = state.selectedContract) => {
      return contractName in state.contracts ? state.contracts[contractName] : undefined
    }
  },
}

const compileMutations: MutationTree<CompileState> = {
  setCompilerType(state, payload) {
    state.compilerType = payload
  },
  saveCompiledCode(state, payload) {
    state.compiledCode = payload
  },
  saveConstructor(state, { name, data }) {
    state.contracts = { ...state.contracts, [name]: data }
  },
  saveSolVersions(state, payload) {
    state.solVersions = payload
  },
  setSolVersion(state, payload) {
    state.selectedSolVersion = payload
  },
  setSelectedContract(state, payload) {
    state.selectedContract = payload
  },
  toggleInBrowserCompiler(state) {
    state.useInBrowserCompiler = !state.useInBrowserCompiler
  },
}

const compileActions: ActionTree<CompileState, RootState> = {
  async loadSolVersions({ state, commit }) {
    const solc = (window as any).AionBrowserSolc
    if (solc) {
      solc.getVersions((sources: any, releases: any) => {
        // console.log(sources)
        // console.log(releases)
        commit('saveSolVersions', Object.values(releases))
      })
    }
  },
  async compile({ state, rootGetters, commit, rootState }) {
    const selectedSolVersion = state.selectedSolVersion
    const contract = rootGetters['workspace/activeFile'].code
    const solc = (window as any).AionBrowserSolc
    const type = state.compilerType
    if (state.useInBrowserCompiler) {
      const handleCompile = async () =>
        new Promise((resolve, reject) => {
          solc.loadVersion(type, selectedSolVersion, (compiler: any) => {
            const optimize = 1
            const result = compiler.compile(contract, optimize)
            console.log(result)
            if ('errors' in result) {
              return reject(new Error(result.errors))
            }
            return resolve(result.contracts)
          })
        })
      const contracts: { [key: string]: any } = await handleCompile()
      commit('saveCompiledCode', contracts)
      for (const [contractName, values] of Object.entries(contracts)) {
        commit('saveConstructor', {
          name: contractName,
          data: extractConstructor(JSON.parse(values.interface)),
        })
      }
      commit('setSelectedContract', Object.keys(contracts)[0])
      return
    }
    const providerInstance = rootState.run.providerInstance
    if (providerInstance && 'compile' in providerInstance) {
      const compiledContracts: {
        [key: string]: any
      } = await providerInstance.compile(contract)
      if ('compile-error' in compiledContracts) {
        throw new Error(compiledContracts['compile-error'].error)
      }
      commit('saveCompiledCode', compiledContracts)
      for (const [
        contractName,
        {
          info: { abiDefinition },
        },
      ] of Object.entries(compiledContracts)) {
        commit('saveConstructor', {
          name: contractName,
          data: extractConstructor(abiDefinition),
        })
      }
      // commit('setSelectedContract', Object.keys(compiledContracts)[0])
    } else {
      throw new Error('Provider not set')
    }
  },
}
export default {
  namespaced: true,
  state: compileState,
  getters: compileGetters,
  mutations: compileMutations,
  actions: compileActions,
}
