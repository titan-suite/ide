import { ActionTree, MutationTree, GetterTree } from 'vuex'
import { RunState, RootState, Account } from '../../types'
import {
  shortenAddress,
  BLOCKCHAINS,
  PROVIDERS,
  getUnits
} from '../../../utils'
import { Aion } from '@titan-suite/core'

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
  deployedContract: {},
  receipts: [],
  providerInstance: undefined,
  isProviderSet: false
}

const runGetters: GetterTree<RunState, RootState> = {
  accounts(state): any {
    return state.accounts.length > 0
      ? state.accounts.map(({ address, etherBalance }) => {
          const label = `${shortenAddress(address)}${
            etherBalance ? ' (' + etherBalance.toString() + ' aion)' : ''
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
    }
  },
  setProvider(state, payload) {
    state.selectedProvider = payload
    if (state.isProviderSet) {
      state.isProviderSet = false
    }
  },
  setProviderAddress(state, payload) {
    state.providerAddress = payload
    if (state.isProviderSet) {
      state.isProviderSet = false
    }
  },
  setProviderInstance(state, payload) {
    state.providerInstance = payload
    state.isProviderSet = true
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
    state.deployedContract = payload
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
            break
        }
        break
      default:
        break
    }
  },
  async deploy({ state, rootState, commit }) {
    const providerInstance = state.providerInstance
    if (providerInstance) {
      const contractName = rootState.compile.selectedContract
      const compiledCode = rootState.compile.compiledCode
      const mainAccount = state.selectedAccount
      const gas = state.gasLimit
      const gasPrice = state.gasPrice
      const code = compiledCode[contractName].code
      const contractArguments = rootState.compile.contracts[contractName] // TODO compile on demand
        ? state.contractArgs
        : ''
      if (process.env.NODE_ENV !== 'production') {
        console.log('deploying with', {
          code,
          mainAccount,
          gas,
          contractArguments
        })
      }
      const res = await providerInstance.deploy({
        code: compiledCode[contractName].code,
        mainAccount,
        gas,
        gasPrice,
        contractArguments
      })
      if (process.env.NODE_ENV !== 'production') {
        console.log(res)
      }
      // commit('saveDeployedContract', res)
      commit('saveReceipt', res.txReceipt)
    } else {
      throw new Error('Provider not set')
    }
  },
  // async retrieveContractFromAddress(
  //   { rootState, commit, rootGetters },
  //   address
  // ) {
  //   const web3 = new Web3(
  //     new Web3.providers.HttpProvider(rootState.compile.nodeAddress)
  //   )
  //   const contract = rootGetters['workspace/activeFile'].code
  //   const contractName = rootState.compile.selectedContract
  //   const compiledCode = await compile({ contract }, web3)
  //   if (contractName in compiledCode) {
  //     const abi: AbiDefinition[] =
  //       compiledCode[contractName].info.abiDefinition
  //     const contractInstance = web3.eth.contract(abi).at(address)
  //     commit('saveDeployedContract', contractInstance)
  //   } else {
  //     throw new Error('Invalid Abi')
  //   }
  // },
  async fetchAccounts({ rootState, commit, state }) {
    const providerInstance = state.providerInstance
    if (providerInstance) {
      const addresses = await providerInstance.getAccounts()
      if (Array.isArray(addresses)) {
        const accounts: any[] = []
        for (const address of addresses) {
          const etherBalance = await providerInstance.getBalance(address)
          accounts.push({
            address,
            etherBalance: Number(etherBalance),
            unlocked: false,
            loading: false
          })
        }
        commit('saveAccounts', accounts)
      } else {
        throw new Error('Unable to fetch Accounts')
      }
    } else {
      throw new Error('Provider not set')
    }
  },
  async unlockAccount({ state, commit }, { address, password }) {
    commit('toggleAccountLoadingStatus', address)
    const providerInstance = state.providerInstance
    if (providerInstance) {
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
