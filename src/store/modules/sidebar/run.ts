import { ActionTree, MutationTree, GetterTree } from 'vuex'
import { AbiDefinition } from 'ethereum-types'
import { RunState, RootState, Account } from '../../types'
import {
  shortenAddress,
  BLOCKCHAINS,
  PROVIDERS,
  getUnits
} from '../../../utils'
import { Aion, Ethereum } from '@titan-suite/core'

let nodeAddress = ''
if (process.env.NODE_ENV !== 'production') {
  nodeAddress = require('../../titanrc').nodeAddress
}

const runState: RunState = {
  blockchains: BLOCKCHAINS,
  providers: PROVIDERS,
  selectedBlockchain: BLOCKCHAINS.AION,
  selectedProvider: PROVIDERS.Web3Provider,
  providerAddress: nodeAddress,
  accountsLoading: false,
  selectedAccount: '',
  accounts: [],
  gasLimit: 2000 * 1000,
  gasPrice: 10000000000000,
  value: {
    amount: 0,
    unit: ''
  },
  contractArgs: '',
  deployedContracts: [],
  receipts: [],
  providerInstance: undefined,
  isProviderSet: false
}

const runGetters: GetterTree<RunState, RootState> = {
  accounts(state): any {
    const units = getUnits(state.selectedBlockchain)
    return state.accounts.length > 0
      ? state.accounts.map(({ address, etherBalance }) => {
          const label = `${shortenAddress(address)}${
            etherBalance
              ? ' (' +
                etherBalance.toString() +
                ` ${units[units.length - 1].value})`
              : ''
          }`
          return {
            label,
            value: address
          }
        })
      : [{ label: 'No Accounts Available', value: '' }]
  },
  getLatestContractAddress(state) {
    return (
      state.receipts.length > 0 &&
      state.receipts[state.receipts.length - 1].contractAddress
    )
  },
  getUnits(state) {
    return getUnits(state.selectedBlockchain)
  },
  showUnlockButtons(state) {
    return state.selectedBlockchain === BLOCKCHAINS.AION
  }
}

export interface SaveValue {
  amount?: number
  unit?: string
}
const runMutations: MutationTree<RunState> = {
  setBlockchain(state, payload) {
    state.selectedBlockchain = payload
    state.value.unit = ''
    if (state.isProviderSet) {
      state.isProviderSet = false
      state.providerInstance = undefined
    }
  },
  setProvider(state, payload) {
    state.selectedProvider = payload
    if (state.isProviderSet) {
      state.isProviderSet = false
      state.providerInstance = undefined
    }
  },
  setProviderAddress(state, payload) {
    state.providerAddress = payload
    if (state.isProviderSet) {
      state.isProviderSet = false
      state.providerInstance = undefined
    }
  },
  setProviderInstance(state, payload) {
    state.providerInstance = payload
    state.isProviderSet = payload ? true : false
  },
  saveAccounts(state, payload) {
    state.accounts = payload
  },
  saveSelectAccount(state, payload) {
    state.selectedAccount = payload
  },
  saveGasLimit(state, payload) {
    state.gasLimit = payload
  },
  saveGasPrice(state, payload) {
    state.gasPrice = payload
  },
  saveValue(state, payload: SaveValue) {
    state.value = { ...state.value, ...payload }
  },
  setContractArgs(state, contractArgs: string) {
    state.contractArgs = contractArgs
  },
  saveDeployedContract(state, payload) {
    state.deployedContracts.push(payload)
  },
  updateAccountStatus(state, { address, status }) {
    const targetAccountIndex = state.accounts.findIndex(
      account => account.address === address
    )
    state.accounts[targetAccountIndex].unlocked = status
  },
  toggleAccountLoadingStatus(state, address) {
    const targetAccountIndex = state.accounts.findIndex(
      account => account.address === address
    )
    state.accounts[targetAccountIndex].loading = !state.accounts[
      targetAccountIndex
    ].loading
  },
  toggleAccountsLoading(state) {
    state.accountsLoading = !state.accountsLoading
  },
  saveReceipt(state, payload) {
    state.receipts = [...state.receipts, payload]
  }
}

const runActions: ActionTree<RunState, RootState> = {
  async instantiateProvider({ state, commit }) {
    switch (state.selectedBlockchain) {
      case BLOCKCHAINS.AION:
        switch (state.selectedProvider) {
          case PROVIDERS.Web3Provider:
            commit('setProviderInstance', new Aion(state.providerAddress))
            break
          default:
            commit('setProviderInstance', undefined)
            break
        }
        break
      case BLOCKCHAINS.ETHEREUM:
        switch (state.selectedProvider) {
          case PROVIDERS.Web3Provider:
            commit('setProviderInstance', new Ethereum(state.providerAddress))
            break
          default:
            commit('setProviderInstance', undefined)
            break
        }
        break
      default:
        commit('setProviderInstance', undefined)
        break
    }
  },
  async deploy({ state, rootState, commit }) {
    const providerInstance = state.providerInstance
    if (providerInstance) {
      const contractName = rootState.compile.selectedContract
      const compiledCode = rootState.compile.compiledCode
      const from = state.selectedAccount
      const gas = state.gasLimit
      const gasPrice = state.gasPrice
      const bytecode = compiledCode[contractName].code
      const abi: AbiDefinition[] =
        compiledCode[contractName].info.abiDefinition
      const contractArguments = rootState.compile.contracts[contractName] // TODO check constructor
        ? state.contractArgs
        : ''
      if (process.env.NODE_ENV !== 'production') {
        console.log('deploying with', {
          bytecode,
          from,
          gas,
          contractArguments
        })
      }
      const res = await providerInstance.deploy({
        bytecode,
        from,
        gas,
        gasPrice,
        contractArguments
      })
      if (process.env.NODE_ENV !== 'production') {
        console.log(res)
      }
      commit('saveDeployedContract', {
        contractAddress: res.txReceipt.contractAddress,
        abi: abi.filter(i => i.type !== 'constructor' && i.type !== 'event')
      })
      commit('saveReceipt', res.txReceipt)
    } else {
      throw new Error('Provider not set')
    }
  },
  async retrieveContractFromAddress(
    { state, rootState, commit, rootGetters },
    address
  ) {
    const providerInstance = state.providerInstance
    if (providerInstance) {
      const contract = rootGetters['workspace/activeFile'].code
      const contractName = rootState.compile.selectedContract
      const compiledCode = await providerInstance.compile(contract)
      if (contractName in compiledCode) {
        const abi: AbiDefinition[] =
          compiledCode[contractName].info.abiDefinition
        commit('saveDeployedContract', {
          contractAddress: address,
          abi: abi.filter(i => i.type !== 'constructor' && i.type !== 'event')
        })
      } else {
        throw new Error('Invalid Abi')
      }
    } else {
      throw new Error('Provider not set')
    }
  },
  async fetchAccounts({ commit, state }) {
    const providerInstance = state.providerInstance
    if (providerInstance) {
      const accounts = await providerInstance.getBalancesWithAccounts()
      commit(
        'saveAccounts',
        accounts.map(acc => {
          return { ...acc, unlocked: false, loading: false }
        })
      )
    } else {
      throw new Error('Provider not set')
    }
  },
  async unlockAccount({ state, commit }, { address, password }) {
    commit('toggleAccountLoadingStatus', address)
    const providerInstance = state.providerInstance
    if (providerInstance && 'unlock' in providerInstance) {
      const status = await providerInstance.unlock(address, password)
      commit('updateAccountStatus', { address, status })
      commit('toggleAccountLoadingStatus', address)
      if (!status) {
        throw new Error('Unlock failed')
      }
    } else {
      throw new Error('Provider not set')
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
