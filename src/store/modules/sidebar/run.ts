import { ActionTree, MutationTree, GetterTree } from 'vuex'
import { RunState, RootState, Account } from '../../types'
import { shortenAddress, BLOCKCHAINS, PROVIDERS, getUnits, parseDeployedContract } from '../../../utils'
import { Aion, Ethereum } from '@titan-suite/core'
import { event } from 'vue-analytics'
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
    unit: '',
  },
  contractArgs: '',
  deployedContracts: [],
  receipts: [],
  providerInstance: devProviderInstance,
  isProviderSet,
  privateKey: undefined,
  isPrivateKeySet: false,
}

const runGetters: GetterTree<RunState, RootState> = {
  accounts(state): any {
    const units = getUnits(state.selectedBlockchain)
    return state.accounts.length > 0
      ? state.accounts.map(({ address, etherBalance }) => {
          const label = `${shortenAddress(address)}${
            etherBalance ? ' (' + etherBalance.toString() + ` ${units[units.length - 1].value})` : ''
          }`
          return {
            label,
            value: address,
          }
        })
      : [{ label: 'No Accounts Available', value: '' }]
  },
  getLatestContractAddress(state) {
    return state.receipts.length > 0 && state.receipts[state.receipts.length - 1].address
  },
  getUnits(state) {
    return getUnits(state.selectedBlockchain)
  },
  showUnlockButtons(state) {
    if (state.selectedBlockchain === state.blockchains.AION) {
      if (state.isPrivateKeySet === false) {
        if (state.selectedProvider !== state.providers.InjectedWeb3) {
          return true
        }
      }
    }
    return false
  },
  providerAddressStatus(state) {
    return state.isProviderSet && state.selectedProvider === state.providers.Web3Provider
      ? state.providerAddress
      : state.selectedProvider === state.providers.InjectedWeb3
      ? 'Using Injected Web3'
      : false
  },
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
      state.privateKey = undefined
      state.selectedAccount = ''
      state.accounts = []
      state.isPrivateKeySet = false
    }
  },
  setProvider(state, payload) {
    state.selectedProvider = payload
    if (state.isProviderSet) {
      state.isProviderSet = false
      state.providerInstance = undefined
      state.selectedAccount = ''
      state.accounts = []
    }
  },
  setProviderAddress(state, payload) {
    state.providerAddress = payload
    if (state.isProviderSet) {
      state.isProviderSet = false
      state.providerInstance = undefined
      state.selectedAccount = ''
      state.accounts = []
    }
  },
  setPrivateKey(state, { key, address }) {
    state.privateKey = { key, address }
    state.isPrivateKeySet = true
  },

  unsetPrivateKey(state) {
    state.privateKey = undefined
    state.isPrivateKeySet = false
    state.selectedAccount = ''
    state.accounts = []
    if (process.env.NODE_ENV === 'production') {
      event('user-click', 'unsetPK', 'unsetPK', true)
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
    const targetAccountIndex = state.accounts.findIndex(account => account.address === address)
    state.accounts[targetAccountIndex].unlocked = status
  },
  toggleAccountLoadingStatus(state, address) {
    const targetAccountIndex = state.accounts.findIndex(account => account.address === address)
    state.accounts[targetAccountIndex].loading = !state.accounts[targetAccountIndex].loading
  },
  toggleAccountsLoading(state) {
    state.accountsLoading = !state.accountsLoading
  },
  saveNewReceipt(state, payload) {
    state.receipts.push(payload)
  },
}

const runActions: ActionTree<RunState, RootState> = {
  async instantiateProvider({ state, commit }) {
    switch (state.selectedBlockchain) {
      case state.blockchains.AION:
        switch (state.selectedProvider) {
          case state.providers.Web3Provider:
            commit('setProviderInstance', new Aion(state.providerAddress))
            break
          case state.providers.InjectedWeb3:
            if (process.env.NODE_ENV !== 'production') {
              console.log((window as any).aionweb3)
            }
            if (!('aionweb3' in window)) {
              throw new Error('No Injected Web3 was detected. Please Download Aiwa from ;http://getaiwa.com')
            }
            commit('setProviderInstance', new Aion('', true, (window as any).aionweb3))
            break
          default:
            commit('setProviderInstance', undefined)
            break
        }
        break
      case state.blockchains.ETHEREUM:
        switch (state.selectedProvider) {
          case state.providers.Web3Provider:
            commit('setProviderInstance', new Ethereum(state.providerAddress))
            break
          case state.providers.InjectedWeb3:
            if (process.env.NODE_ENV !== 'production') {
              console.log((window as any).web3)
            }
            if (!('web3' in window)) {
              throw new Error('No Injected Web3 was detected. Please Download Metamask from ;https://metamask.io')
            }
            commit('setProviderInstance', new Ethereum('', true, (window as any).web3))
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
  async deploy({ state, rootState, commit, dispatch }) {
    const providerInstance = state.providerInstance
    if (!providerInstance) {
      throw new Error('Provider not set')
    }
    const contractName = rootState.compile.selectedContract
    const compiledCode = rootState.compile.compiledCode
    const useInBrowserCompiler = rootState.compile.useInBrowserCompiler
    const from = state.selectedAccount
    const gas = state.gasLimit
    const gasPrice = state.gasPrice
    const code = useInBrowserCompiler ? '0x' + compiledCode[contractName].bytecode : compiledCode[contractName].code
    const abi = useInBrowserCompiler
      ? JSON.parse(compiledCode[contractName].interface)
      : compiledCode[contractName].info.abiDefinition
    const contractArgs = rootState.compile.contracts[contractName] // TODO check constructor
      ? state.contractArgs
      : ''
    const args: any[] = [...JSON.parse(`[${contractArgs}]`)]
    if (process.env.NODE_ENV !== 'production') {
      console.log('deploying with', {
        abi,
        code,
        from: state.isPrivateKeySet ? state.privateKey!.address : from,
        gas,
        gasPrice,
        args,
        privateKey: state.isPrivateKeySet ? state.privateKey!.key : undefined,
      })
    }
    const { txReceipt, txHash } = await providerInstance.deploy({
      abi,
      code,
      from: state.isPrivateKeySet ? state.privateKey!.address : from,
      gas,
      gasPrice,
      args,
      privateKey: state.isPrivateKeySet ? state.privateKey!.key : undefined,
    })
    if (process.env.NODE_ENV !== 'production') {
      console.log({ txReceipt, txHash })
    }
    if (process.env.NODE_ENV === 'production') {
      event('user-click', 'Deploy', 'Deploy', true)
    }
    if (txReceipt && txReceipt.contractAddress) {
      commit('saveDeployedContract', {
        ...parseDeployedContract(contractName, txReceipt.contractAddress, abi),
        contractInstance: providerInstance.getContract(abi, txReceipt.contractAddress),
      })
      dispatch('saveReceipt', txReceipt)
    } else {
      throw new Error('Failed to fetch receipt.')
    }
  },
  async retrieveContractFromAddress({ state, rootState, commit, rootGetters, dispatch }, address) {
    const providerInstance = state.providerInstance
    if (!providerInstance) {
      throw new Error('Provider not set')
    }
    const contractName = rootState.compile.selectedContract
    const compiledCode = rootState.compile.compiledCode
    const useInBrowserCompiler = rootState.compile.useInBrowserCompiler
    if (contractName in compiledCode) {
      const abi = useInBrowserCompiler
        ? JSON.parse(compiledCode[contractName].interface)
        : compiledCode[contractName].info.abiDefinition
      commit('saveDeployedContract', {
        ...parseDeployedContract(contractName, address, abi),
        contractInstance: providerInstance.getContract(abi, address),
      })
      if (process.env.NODE_ENV === 'production') {
        event('response', 'Retrieve Contract', 'Retrieve Contract', true)
      }
    } else {
      throw new Error('Invalid Abi')
    }
  },
  async fetchAccounts({ commit, state }) {
    const providerInstance = state.providerInstance
    if (!providerInstance) {
      throw new Error('Provider not set')
    }
    commit('toggleAccountsLoading')
    try {
      let accounts: Account[]
      if (state.isPrivateKeySet) {
        const address = state.privateKey!.address
        const etherBalance = await providerInstance.getBalance(address)
        accounts = [{ address, etherBalance, unlocked: false, loading: false }]
      } else {
        const res = await providerInstance.getBalancesWithAccounts()
        accounts = res.map(acc => {
          return { ...acc, unlocked: false, loading: false }
        })
      }
      commit('saveAccounts', accounts)
      if (process.env.NODE_ENV === 'production') {
        event('user-click', 'Fetch Accounts', 'Fetch Accounts', true)
      }
    } catch (e) {
      throw e
    } finally {
      commit('toggleAccountsLoading')
    }
  },
  async unlockAccount({ state, commit }, { address, password }) {
    commit('toggleAccountLoadingStatus', address)
    const providerInstance = state.providerInstance
    if (providerInstance && 'unlock' in providerInstance) {
      const status = await providerInstance.unlock(address, password)
      commit('updateAccountStatus', { address, status })
      commit('toggleAccountLoadingStatus', address)
      if (process.env.NODE_ENV === 'production') {
        event('user-click', 'Unlock Account', 'Unlock Account', true)
      }
      if (!status) {
        throw new Error('Unlock failed')
      }
    } else {
      throw new Error('Provider not set')
    }
  },
  async saveReceipt({ commit }, payload) {
    const address = payload.contractAddress || payload.transactionHash || payload.to
    const title = `${
      payload.contractAddress ? 'Contract: ' : payload.transactionHash ? 'Tx Hash: ' : 'Call: '
    } ${shortenAddress(address)}`
    const data = Object.keys(payload).map((j: any) => {
      return {
        key: j,
        value: payload[j],
      }
    })
    commit('saveNewReceipt', {
      title,
      address,
      data,
    })
    if (process.env.NODE_ENV === 'production') {
      event('response', 'Save Receipt', 'Save Receipt', true)
    }
  },
  async importPrivateKey({ state, commit, dispatch }, key) {
    const providerInstance = state.providerInstance
    if (!providerInstance) {
      throw new Error('Provider not set')
    }
    const { address } = await providerInstance.web3.eth.accounts.privateKeyToAccount(key)
    commit('setPrivateKey', { key, address })
    commit('saveSelectAccount', address)
    dispatch('fetchAccounts')
    if (process.env.NODE_ENV === 'production') {
      event('user-click', 'Import private key', 'Import private key', true)
    }
  },
}

export default {
  namespaced: true,
  state: runState,
  getters: runGetters,
  mutations: runMutations,
  actions: runActions,
}
