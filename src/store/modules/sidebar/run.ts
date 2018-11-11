import { ActionTree, MutationTree, GetterTree } from 'vuex'
import { RunState, RootState } from '../../types'
import Web3, { deploy } from '../../../../@titan-suite/core/aion/dist'
const runState: RunState = {
  // environment: [
  //  { name: 'Web3 Provider', endpoint: ''},
  // ],
  selectedAccount: '',
  accounts: [],
  gasLimit: 69,
  value: {
    amount: 0,
    unit: 'wei'
  }
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

const runMutations: MutationTree<RunState> = {
  saveAccounts(state, payload) {
    state.accounts = payload
  },
  saveSelectAccount(state, payload) {
    state.selectedAccount = payload
  }
}

const runActions: ActionTree<RunState, RootState> = {
  // async deploy({ state, rootState, commit, dispatch, getters, rootGetters }) {
  //   const code =
  //     rootState.workspace.workspaces[rootState.workspace.activeWorkspaceIndex]
  //       .projectTree.folders[0].files[0].code
  //   try {
  //     // const web3 = new Web3(new Web3.providers.HttpProvider(nodeAddress))
  //     console.log({ web3 })
  //     commit('deployMutations', {})
  //   } catch (error) {
  //     console.log(error)
  //     throw error
  //   }
  // },
  async fetchAccounts({
    state,
    rootState,
    commit,
    dispatch,
    getters,
    rootGetters
  }) {
    if (!rootState.compile.isConnectedToNode) {
      return
    }
    try {
      const web3 = new Web3(
        new Web3.providers.HttpProvider(rootState.compile.nodeAddress)
      )
      const getAccounts = () => {
        return new Promise((resolve, reject) => {
          web3.eth.getAccounts((err, acc) => {
            if (err) {
              reject(err)
            }
            resolve(acc)
          })
        })
      }
      const addresses = await getAccounts()
      const accounts =
        Array.isArray(addresses) &&
        addresses.map((address: string) => {
          const etherBalance = web3.fromWei(
            web3.eth.getBalance(address),
            'ether'
          )
          return {
            address,
            etherBalance: Number(etherBalance)
          }
        })
      commit('saveAccounts', accounts)
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
