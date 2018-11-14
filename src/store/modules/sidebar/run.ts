import { ActionTree, MutationTree, GetterTree } from 'vuex'
import { RunState, RootState, Account } from '../../types'
import {
  deploy,
  unlock,
  compile,
  getAccounts,
  getBalance
} from '@titan-suite/core'
import Web3 from 'aion-web3'
import { AbiDefinition } from 'ethereum-types'
const runState: RunState = {
  // environment: [
  //  { name: 'Web3 Provider', endpoint: ''},
  // ],
  accountsLoading: false,
  selectedAccount: '',
  accounts: [],
  gasLimit: 2000 * 1000,
  value: {
    amount: 0,
    unit: 'wei'
  },
  units: [
    {
      value: 'wei',
      label: 'Wei'
    },
    {
      value: 'gwei',
      label: 'Gwei'
    },
    {
      value: 'finney',
      label: 'Finney'
    },
    {
      value: 'ether',
      label: 'Ether'
    }
  ],
  contractArgs: '',
  deployedContract: {},
  receipts: []
}

const runGetters: GetterTree<RunState, RootState> = {
  accounts(state): any {
    return state.accounts.length > 0
      ? state.accounts.map(({ address, etherBalance }) => {
          const len = address.length
          const label = `${address.slice(0, 5)}...${address.slice(
            len - 5,
            len
          )}${etherBalance ? ' (' + etherBalance.toString() + ' ether)' : ''}`
          return {
            label,
            value: address
          }
        })
      : [{ label: 'No Accounts Available', value: '' }]
  }
}

export interface SaveValue {
  amount?: number
  unit?: string
}
const runMutations: MutationTree<RunState> = {
  saveAccounts(state, payload) {
    state.accounts = payload
  },
  saveSelectAccount(state, payload) {
    state.selectedAccount = payload
  },
  saveGasLimit(state, payload) {
    state.gasLimit = payload
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
      (account) => account.address === address
    )
    state.accounts[targetAccountIndex].unlocked = status
  },
  toggleAccountLoadingStatus(state, address) {
    const targetAccountIndex = state.accounts.findIndex(
      (account) => account.address === address
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
  async deploy({ state, rootState, commit }) {
    try {
      const web3 = new Web3(
        new Web3.providers.HttpProvider(rootState.compile.nodeAddress)
      )
      const contractName = rootState.compile.selectedContract
      const compiledCode = rootState.compile.compiledCode
      const mainAccount = state.selectedAccount
      const gas = state.gasLimit
      const abi = compiledCode[contractName].info.abiDefinition
      const code = compiledCode[contractName].code
      const contractArgs = rootState.compile.contracts[contractName] // TODO
        ? state.contractArgs
        : ''
      console.log('deploying with', {
        abi,
        code,
        mainAccount,
        gas,
        contractArguments: contractArgs
      })
      const res = await deploy(
        {
          abi: compiledCode[contractName].info.abiDefinition,
          code: compiledCode[contractName].code,
          mainAccount,
          gas: 4700000,
          contractArguments: contractArgs
        },
        web3
      )
      console.log(res)
      commit('saveDeployedContract', res)
      commit('saveReceipt', res.receipt)
    } catch (error) {
      throw error
    }
  },
  async retrieveContractFromAddress(
    { rootState, commit, rootGetters },
    address
  ) {
    try {
      const web3 = new Web3(
        new Web3.providers.HttpProvider(rootState.compile.nodeAddress)
      )
      const contract = rootGetters['workspace/activeFileCode']
      const contractName = rootState.compile.selectedContract
      const compiledCode = await compile({ contract }, web3)
      if (contractName in compiledCode) {
        const abi: AbiDefinition[] =
          compiledCode[contractName].info.abiDefinition
        const contractInstance = web3.eth.contract(abi).at(address)
        console.log({ contractInstance })
        commit('saveDeployedContract', contractInstance)
      } else {
        throw new Error('Invalid Abi')
      }
    } catch (error) {
      throw error
    }
  },
  async fetchAccounts({ rootState, commit }) {
    try {
      const web3 = new Web3(
        new Web3.providers.HttpProvider(rootState.compile.nodeAddress)
      )

      const addresses = await getAccounts(web3)
      if (Array.isArray(addresses)) {
        const accounts: Account[] = await Promise.all(
          addresses.map(async (address: string) => {
            const etherBalance = await getBalance({ address }, web3)
            return {
              address,
              etherBalance: Number(etherBalance),
              unlocked: false,
              loading: false
            }
          })
        )
        commit('saveAccounts', accounts)
        commit('saveSelectAccount', accounts[0].address)
        return
      } else {
        throw new Error('Unable to fetch Accounts')
      }
    } catch (error) {
      throw error
    }
  },
  async unlockAccount({ rootState, commit }, { address, password }) {
    try {
      commit('toggleAccountLoadingStatus', address)
      const web3 = new Web3(
        new Web3.providers.HttpProvider(rootState.compile.nodeAddress)
      )
      await unlock({ mainAccount: address, mainAccountPass: password }, web3)
      commit('updateAccountStatus', { address, status: true })
      return
    } catch (error) {
      throw error
    } finally {
      commit('toggleAccountLoadingStatus', address)
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
