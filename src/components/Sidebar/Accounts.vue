<template>
  <div>
    <el-table :data="formattedAccounts" :border="false" style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <p>{{ props.row.address.length>0 ? `Address: ${props.row.address}`: props.row.address }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="shortenAddress" label="Address" />
      <el-table-column prop="etherBalance" label="Balance" />
      <el-table-column align="center">
        <template slot-scope="slot" slot="header">
          <el-button :loading="accountsLoading" type="primary" size="mini" icon="el-icon-refresh" @click="getAccounts">
            {{ accountsLoading?'Refreshing':'Refresh' }}</el-button>
        </template>

        <template slot-scope="scope">
          <el-popover v-model="scope.row.popoverOpen" trigger="hover" placement="left" width="200">
            <el-input v-model="scope.row.password" type="password" placeholder="Account Password" clearable />
            <div style="text-align: right; margin: 0;padding:inherit">
              <el-button size="mini" type="text" @click="scope.row.popoverOpen = false">Cancel</el-button>
              <el-button type="primary" size="mini" @click="unlockAccount({ address:scope.row.address, password:scope.row.password });scope.row.popoverOpen = false">Confirm</el-button>
            </div>
            <el-button v-show="accounts.length>0" slot="reference" :loading="scope.row.loading" :type="scope.row.unlocked?'success':'info'" size="mini" @click="scope.row.password = ''">
              {{ scope.row.unlocked?'Unlocked':'Unlock' }}</el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Action, State, Mutation } from 'vuex-class'
import { Account } from '../../store/types'
@Component
export default class Accounts extends Vue {
    @State('accounts', { namespace: 'run' }) public accounts!: Account[]
    @State('accountsLoading', { namespace: 'run' }) public accountsLoading!: boolean

    @Action('fetchAccounts', { namespace: 'run' }) public fetchAccounts!: () => void
    @Action('unlockAccount', { namespace: 'run' }) public unlockAccount!: ({}: { address: string, password: string }) => void

    @Mutation('toggleAccountsLoading', { namespace: 'run' }) public toggleAccountsLoading!: () => void
    @Mutation('setNodeStatus', { namespace: 'compile' }) public setNodeStatus!: (status: boolean) => void

    public async getAccounts(): Promise < void > {
        try {
            this.toggleAccountsLoading()
            this.setNodeStatus(true) // TODO validate node and then fetch 
            await this.fetchAccounts()
        } catch (e) {
            throw e
        } finally {
            this.toggleAccountsLoading()
        }


    }

    public get formattedAccounts() {
        return this.accounts.length > 0 ? this.accounts.map(account => ({ ...account, popoverOpen: false, password: '', shortenAddress: this.shortenAddress(account.address) })) : [{ address: '', etherBalance: '', shortenAddress: '' }]
    }

    public shortenAddress(address: string): string {
        const len = address.length
        const label = `${address.slice(0, 5)}...${address.slice(len - 5,len)}`
        return label
    }
}
</script>
