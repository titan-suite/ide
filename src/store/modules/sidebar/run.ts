import { ActionTree, MutationTree, GetterTree } from 'vuex'
import { RunState, RootState, Account } from '../../types'
import {
  shortenAddress,
  BLOCKCHAINS,
  PROVIDERS,
  getUnits,
  parseDeployedContract
} from '../../../utils'
import { Aion, Ethereum } from '@titan-suite/core'
let nodeAddress = ''
let devProviderInstance
let isProviderSet = false

if (process.env.NODE_ENV !== 'production') {
  nodeAddress = require('../../titanrc').nodeAddress
  devProviderInstance = new Aion(nodeAddress)
  isProviderSet = true
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
  providerInstance: devProviderInstance,
  isProviderSet
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
      state.receipts[state.receipts.length - 1].address
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
    const address =
      payload.contractAddress || payload.transactionHash || payload.to
    const receipt = {
      title: `${
        payload.contractAddress
          ? 'Contract: '
          : payload.transactionHash
          ? 'Tx Hash: '
          : 'Call: '
      } ${shortenAddress(address)}`,
      address,
      data: Object.keys(payload).map((j: any) => {
        return {
          key: j,
          value: payload[j]
        }
      })
    }
    state.receipts.push(receipt)
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
          case PROVIDERS.InjectedWeb3:
            console.log((window as any).aionweb3)
            commit(
              'setProviderInstance',
              new Aion('', true, (window as any).aionweb3)
            )
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
          case PROVIDERS.InjectedWeb3:
            console.log((window as any).web3)
            commit(
              'setProviderInstance',
              new Ethereum('', true, (window as any).web3)
            )
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
    if (!providerInstance) {
      throw new Error('Provider not set')
    }
    const blockchain = state.selectedBlockchain
    const contractName = rootState.compile.selectedContract
    const compiledCode = rootState.compile.compiledCode
    const from = state.selectedAccount
    const gas = state.gasLimit
    const gasPrice = state.gasPrice
    const code =
      blockchain === BLOCKCHAINS.AION
        ? compiledCode[contractName].code
        : compiledCode[contractName].bytecode
    const abi =
      blockchain === BLOCKCHAINS.AION
        ? compiledCode[contractName].info.abiDefinition
        : JSON.parse(compiledCode[contractName].interface)
    const contractArgs = rootState.compile.contracts[contractName] // TODO check constructor
      ? state.contractArgs
      : ''
    const args: any[] = [...JSON.parse(`[${contractArgs}]`)]
    if (process.env.NODE_ENV !== 'production') {
      console.log('deploying with', {
        code,
        from,
        gas,
        gasPrice,
        args
      })
    }
    const { txReceipt, txHash } = await providerInstance.deploy({
      abi,
      code,
      from,
      gas,
      gasPrice,
      args
    })
    if (process.env.NODE_ENV !== 'production') {
      console.log({ txReceipt, txHash })
    }
    if (txReceipt && txReceipt.contractAddress) {
      commit('saveDeployedContract', {
        ...parseDeployedContract(contractName, txReceipt.contractAddress, abi),
        contractInstance: providerInstance.getContract(
          abi,
          txReceipt.contractAddress
        )
      })
      commit('saveReceipt', txReceipt)
    } else {
      throw new Error('Failed to fetch receipt.')
    }
  },
  async retrieveContractFromAddress(
    { state, rootState, commit, rootGetters, dispatch },
    address
  ) {
    const providerInstance = state.providerInstance
    if (!providerInstance) {
      throw new Error('Provider not set')
    }
    const blockchain = state.selectedBlockchain
    const contractName = rootState.compile.selectedContract
    const compiledCode = rootState.compile.compiledCode
    if (contractName in compiledCode) {
      const abi =
        blockchain === BLOCKCHAINS.AION
          ? compiledCode[contractName].info.abiDefinition
          : JSON.parse(compiledCode[contractName].interface)
      commit('saveDeployedContract', {
        ...parseDeployedContract(contractName, address, abi),
        contractInstance: providerInstance.getContract(abi, address)
      })
    } else {
      throw new Error('Invalid Abi')
    }
  },
  async fetchAccounts({ commit, state }) {
    const providerInstance = state.providerInstance
    if (!providerInstance) {
      throw new Error('Provider not set')
    }
    const res = await providerInstance.getBalancesWithAccounts()
    const accounts: Account[] = res.map(acc => {
      return { ...acc, unlocked: false, loading: false }
    })
    commit('saveAccounts', accounts)
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
  },
  async saveTxReceipt({ state, commit }, functionCall) {
    const providerInstance = state.providerInstance
    if (!providerInstance) {
      throw new Error('Provider not set')
    }
    const receipt = await providerInstance.getResponseWhenMined(functionCall)
    commit('saveReceipt', receipt)
  }
}

export default {
  namespaced: true,
  state: runState,
  getters: runGetters,
  mutations: runMutations,
  actions: runActions
}
