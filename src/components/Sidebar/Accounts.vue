<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-button
          id="addAccount"
          type="primary"
          class="secondaryButton"
          icon="el-icon-plus"
          size="medium"
          style="float:right"
          @click="createAccount"
        >Create an Account</el-button>
      </el-col>
    </el-row>
    <el-table :data="formattedAccounts" :border="false" style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <p>
            {{
              props.row.address.length > 0
                ? `Address: ${props.row.address}`
                : props.row.address
            }}
          </p>
        </template>
      </el-table-column>
      <el-table-column prop="shortenAddress" label="Address"/>
      <el-table-column prop="etherBalance" label="Balance"/>
      <el-table-column :width="accountsLoading ? '140px' : ''" align="center">
        <template slot-scope="slot" slot="header">
          <el-button
            id="refreshAccounts"
            :loading="accountsLoading"
            type="primary"
            size="mini"
            icon="el-icon-refresh"
            @click="getAccounts"
          >{{ accountsLoading ? 'Refreshing' : 'Refresh' }}</el-button>
        </template>

        <template slot-scope="scope" v-if="showUnlockButtons">
          <el-popover v-model="scope.row.popoverOpen" trigger="click" placement="left" width="250">
            <el-input
              :id="scope.row.popoverOpen ? 'unlockPasswordInput' : undefined"
              v-model="scope.row.password"
              type="password"
              placeholder="Account Password"
              clearable
            />
            <div style="text-align: right; margin: 0;padding:inherit">
              <el-button
                id="cancelUnlock"
                size="mini"
                type="text"
                @click="scope.row.popoverOpen = false"
              >Cancel</el-button>
              <el-button
                id="confirmUnlock"
                type="primary"
                size="mini"
                @click="
                  handleUnlock(scope.row.address, scope.row.password)
                  scope.row.popoverOpen = false
                "
              >Confirm</el-button>
            </div>
            <el-button
              v-show="accounts.length > 0"
              id="unlock"
              slot="reference"
              :loading="scope.row.loading"
              :type="scope.row.unlocked ? 'success' : 'info'"
              size="mini"
              @click="scope.row.password = ''"
            >{{ scope.row.unlocked ? 'Unlocked' : 'Unlock' }}</el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Action, State, Mutation, Getter } from 'vuex-class'
import { Notification } from 'element-ui'
import { Account } from '../../store/types'
import { shortenAddress } from '../../utils'
@Component
export default class Accounts extends Vue {
  @State('accounts', { namespace: 'run' }) public accounts!: Account[]
  @State('isPrivateKeySet', { namespace: 'run' }) public isPrivateKeySet!: boolean
  @State('accountsLoading', { namespace: 'run' }) public accountsLoading!: boolean
  @State('providerInstance', { namespace: 'run' }) public providerInstance!: any
  @Getter('showUnlockButtons', { namespace: 'run' }) public showUnlockButtons!: boolean

  @Action('fetchAccounts', { namespace: 'run' }) public fetchAccounts!: () => void
  @Action('unlockAccount', { namespace: 'run' }) public unlockAccount!: (params: { address: string; password: string }) => void

  public $copyText: any

  public async getAccounts(): Promise<void> {
    try {
      await this.fetchAccounts()
    } catch (e) {
      await Notification.error({
        title: 'Error',
        message: `${e.message}${JSON.stringify(e)}`,
      })
      console.error(e)
    }
  }
  public async handleUnlock(address: string, password: string): Promise<void> {
    try {
      await this.unlockAccount({
        address,
        password,
      })
    } catch (e) {
      await Notification.error({
        title: 'Error',
        message: `${e.message}${JSON.stringify(e)}`,
      })
      console.error(e)
    }
  }

  public async createAccount() {
    try {
      if (this.providerInstance) {
        const data = await this.providerInstance.newAccount('titan')
        console.log(data)
        this.$copyText(JSON.stringify(data))
        await Notification.success({
          title: 'Success',
          message: 'Account Copied to clipboard',
          duration: 5000,
        })
      } else {
        throw new Error('Provider not set')
      }
    } catch (e) {
      await Notification.error({
        title: 'Error',
        message: 'Couldn\'t create an Account try Again.',
      })
      console.error(e)
    }
  }

  public get formattedAccounts() {
    return this.accounts.length > 0
      ? this.accounts.map(account => ({
          ...account,
          popoverOpen: false,
          password: '',
          shortenAddress: shortenAddress(account.address),
        }))
      : [{ address: '', etherBalance: '', shortenAddress: '' }]
  }
}
</script>
