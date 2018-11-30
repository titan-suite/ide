<template>
  <div>
    <el-row>
      <el-col :span="12">
        <el-button
          id="importPK"
          :icon="isPrivateKeySet ? 'el-icon-warning':'el-icon-upload'"
          type="primary"
          class="secondaryButton"
          size="medium"
          @click="handleImportPKButtonClick"
        >{{ isPrivateKeySet ? 'Using Private Key': 'Import Private Key' }}</el-button>
      </el-col>
      <el-col :span="12">
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
    <el-dialog :visible.sync="showImportDialog" title="Import Private Key" width="30%">
      <el-row>
        <el-col :span="24">
          <p>Warning: Your private key is only being used in this IDE session and will not be stored. As a rule of thumb, don't give your private keys to anyone!</p>
        </el-col>
      </el-row>
      <el-row :gutter="11">
        <el-col :span="7" :offset="1">
          <p>Private Key</p>
        </el-col>
        <el-col :span="15">
          <el-input id="privateKeyInput" v-model="privateKeyModel" type="password" clearable/>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" class="secondaryButton" @click="showImportDialog = false">Cancel</el-button>
        <el-button type="primary" @click="handlePrivateKeyImport">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Action, State, Mutation, Getter } from 'vuex-class'
import { Notification } from 'element-ui'
import { Account } from '../../store/types'
import { shortenAddress } from '../../utils'
const namespace = 'run'
@Component
export default class Accounts extends Vue {
  @State('accounts', { namespace }) public accounts!: Account[]
  @State('isPrivateKeySet', { namespace }) public isPrivateKeySet!: boolean
  @State('accountsLoading', { namespace }) public accountsLoading!: boolean
  @State('providerInstance', { namespace }) public providerInstance!: any
  @Getter('showUnlockButtons', { namespace }) public showUnlockButtons!: boolean

  @Mutation('unsetPrivateKey', { namespace }) public unsetPrivateKey!: () => void
  @Action('importPrivateKey', { namespace }) public importPrivateKey!: (key: string) => void
  @Action('fetchAccounts', { namespace }) public fetchAccounts!: () => void
  @Action('unlockAccount', { namespace }) public unlockAccount!: (params: { address: string; password: string }) => void

  public $copyText: any
  public showImportDialog: boolean = false
  public privateKeyModel: string = ''

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
        const data = await this.providerInstance.newAccount()
        this.$copyText(JSON.stringify(data))
        await Notification.success({
          title: 'Success',
          message: 'Account Copied to clipboard',
          duration: 5000,
        })
      } else {
        await Notification.error({
          title: 'Error',
          message: 'Provider not set.',
        })
      }
    } catch (e) {
      // console.error(e)
      this.createAccount()
    }
  }

  public async handleImportPKButtonClick(): Promise<void> {
    if (this.isPrivateKeySet) {
      this.$confirm('Do you want to unset the Private key ?', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        cancelButtonClass: 'secondaryButton',
        type: 'warning',
      })
        .then(() => {
          this.unsetPrivateKey()
        })
        .catch(e => {})
    } else {
      this.showImportDialog = true
    }
  }

  public async handlePrivateKeyImport(): Promise<void> {
    try {
      await this.importPrivateKey(this.privateKeyModel)
    } catch (e) {
      await Notification.error({
        title: 'Error',
        message: `${e.message}${JSON.stringify(e)}`,
      })
      console.error(e)
    } finally {
      this.showImportDialog = false
      this.privateKeyModel = ''
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
