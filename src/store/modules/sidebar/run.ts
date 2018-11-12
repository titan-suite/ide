import { ActionTree, MutationTree, GetterTree } from 'vuex'
import { RunState, RootState, Account } from '../../types'
import Web3, {
  deploy,
  unlock,
  getAccounts,
  getBalance
} from '@titan-suite/core/aion'
const runState: RunState = {
  // environment: [
  //  { name: 'Web3 Provider', endpoint: ''},
  // ],
  selectedAccount: '',
  accounts: [],
  accountPassword: '',
  gasLimit: 200 * 1000,
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
  deployedContract: {}
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
  saveAccountPassword(state, payload) {
    state.accountPassword = payload
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
  saveDeployedContract(state, payload) {
    state.deployedContract = payload
  },
  updateAccountStatus(state, { address, status }) {
    const targetAccountIndex = state.accounts.findIndex(
      account => account.address === address
    )
    state.accounts[targetAccountIndex].unlocked = status
  }
}

const runActions: ActionTree<RunState, RootState> = {
  async deploy({ state, rootState, commit, dispatch, getters, rootGetters }) {
    const contract = `pragma solidity ^0.4.9;
    contract Example {
        uint128 public num = 5;
        event NumChanged (uint128);
        function add(uint128 a) public returns (uint128) {
            return num+a;
        }
        function setA(uint128 a) public {
            num = a;
            NumChanged(num);
        }}
      contract WithConstructor {
      uint128 public num = 5;
      event NumChanged (uint128);
      function add(uint128 a) public returns (uint128) {
          return num+a;
      }
      function WithConstructor(uint128 a) public {
        num = a;
      }
      function setA(uint128 a) public {
          num = a;
          NumChanged(num);
      }}`
    try {
      const web3 = new Web3(
        new Web3.providers.HttpProvider(rootState.compile.nodeAddress)
      )
      console.log({ web3 })
      const contractName = rootState.compile.selectedContract
      const mainAccount = state.selectedAccount
      const gas = state.gasLimit
      const mainAccountPass = state.accountPassword
      const res = await deploy({
        contract,
        contractName,
        mainAccount,
        mainAccountPass,
        gas,
        web3,
        contractArguments: ''
      })
      commit('saveDeployedContract', res)
    } catch (error) {
      console.log(error)
      throw error
    }
  },
  async fetchAccounts({
    state,
    rootState,
    commit,
    dispatch,
    getters,
    rootGetters
  }) {
    try {
      const web3 = new Web3(
        new Web3.providers.HttpProvider(rootState.compile.nodeAddress)
      )

      const addresses = await getAccounts({ web3 })
      if (Array.isArray(addresses)) {
        const accounts: Account[] = await Promise.all(
          addresses.map(async (address: string) => {
            const etherBalance = await getBalance({ address, web3 })
            return {
              address,
              etherBalance: Number(etherBalance),
              unlocked: false
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
      console.log(error)
      throw error
    }
  },
  async unlockAccount(
    { state, rootState, commit, dispatch, getters, rootGetters },
    { address, password }
  ) {
    try {
      const web3 = new Web3(
        new Web3.providers.HttpProvider(rootState.compile.nodeAddress)
      )
      await unlock({ mainAccount: address, mainAccountPass: password, web3 })
      commit('updateAccountStatus', { address, status: true })
      return
    } catch (error) {
      console.log(error)
      throw error
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
