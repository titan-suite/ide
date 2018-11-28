<template>
  <div>
    <NodeAddressInput id="run"/>

    <el-row v-if="!isPrivateKeySet" :gutter="11">
      <el-col :span="7" :offset="1">
        <p>Account</p>
      </el-col>
      <el-col :span="11">
        <el-select
          id="accountSelect"
          v-model="selectedAccountModel"
          :loading="accountsLoading"
          class="select"
          placeholder="Choose an Account"
          style="display: block"
        >
          <el-option
            v-for="account in accounts"
            :key="account.value"
            :label="account.label"
            :value="account.value"
          />
        </el-select>
      </el-col>
      <el-col :span="2">
        <el-button
          id="refreshAccounts"
          :loading="accountsLoading"
          type="primary"
          size="mini"
          icon="el-icon-refresh"
          circle
          style="margin-top:0.69rem"
          @click="getAccounts"
        />
      </el-col>
      <el-col :span="2">
        <el-button
          id="copyAccount"
          type="primary"
          class="secondaryButton"
          size="mini"
          icon="el-icon-tickets"
          circle
          style="margin-top:0.69rem"
          @click="$copyText(selectedAccount);$notify({
            title: 'Success',
            message: 'Copied Address to clipboard',
            type: 'success',
            duration: 1500
          })"
        />
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="7" :offset="1">
        <p>Gas Limit</p>
      </el-col>
      <el-col :span="13">
        <el-input
          id="gasLimitInput"
          v-model="gasLimitModel"
          :value="gasLimit"
          type="number"
          clearable
        />
      </el-col>
    </el-row>

    <el-row v-if="!isPrivateKeySet">
      <el-col :span="7" :offset="1">
        <p>Gas Price</p>
      </el-col>
      <el-col :span="13">
        <el-input
          id="gasPriceInput"
          v-model="gasPriceModel"
          :value="gasPrice"
          type="number"
          clearable
        />
      </el-col>
    </el-row>

    <el-row :gutter="11">
      <el-col :span="7" :offset="1">
        <p>Value</p>
      </el-col>
      <el-col :span="7">
        <el-input
          id="valueInput"
          v-model="amountModel"
          :value="value.amount"
          type="number"
          clearable
        />
      </el-col>
      <el-col :span="6">
        <el-select
          id="valueSelect"
          v-model="unitModel"
          class="select"
          placeholder="Unit"
          style="display: block"
        >
          <el-option
            v-for="unit in getUnits"
            :key="unit.value"
            :label="unit.label"
            :value="unit.value"
          />
        </el-select>
      </el-col>
    </el-row>

    <el-row :gutter="11">
      <el-col :span="20" :offset="1">
        <ContractNameSelect id="run"/>
      </el-col>
      <el-col :span="3">
        <el-button
          id="contractRefresh"
          :loading="compileLoading"
          type="primary"
          size="mini"
          icon="el-icon-refresh"
          circle
          style="margin-top:0.69rem"
          @click="handleCompile"
        />
      </el-col>
    </el-row>

    <el-row>
      <el-col :offset="1" :span="deployLoading ? 8: 7">
        <el-button
          id="deploy"
          :loading="deployLoading"
          style="width:100%"
          type="primary"
          class="textColorBlack"
          @click="handleDeploy"
        >Deploy</el-button>
      </el-col>
      <el-col v-if="constructorArgs" :span="deployLoading ? 12: 13">
        <el-popover
          :content="constructorArgs"
          :open-delay="200"
          placement="bottom-start"
          width="50%"
          trigger="focus"
        >
          <el-input
            id="deployArgsInput"
            slot="reference"
            v-model="contractArgsModel"
            :placeholder="constructorArgs"
            clearable
          />
        </el-popover>
      </el-col>
    </el-row>

    <el-row style="margin-top:-20px;margin-bottom:0px">
      <el-col :offset="3">
        <p>or</p>
      </el-col>
    </el-row>

    <el-row type="flex">
      <el-col :offset="1" :span="retrieveContractFromAddressLoading ? 8: 7">
        <el-button
          id="atAddress"
          :loading="retrieveContractFromAddressLoading"
          style="width:100%"
          class="secondaryButton"
          type="primary"
          @click="handleRetrieveContractFromAddress"
        >At Address</el-button>
      </el-col>
      <el-col :span="retrieveContractFromAddressLoading ? 12: 13">
        <el-input
          id="contractAddressInput"
          v-model="fromAddressModel"
          placeholder="Load contract from Address"
          clearable
        />
      </el-col>
    </el-row>
    <ContractInteraction/>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Action, Mutation, Getter, State } from 'vuex-class'
import { Notification } from 'element-ui'
import { Account, Value } from '../../store/types'
import { ParsedContractConstructor } from '../../store/modules/sidebar/compile'
import { SaveValue } from '../../store/modules/sidebar/run'
import NodeAddressInput from './NodeAddressInput.vue'
import ContractNameSelect from './ContractNameSelect.vue'
import ContractInteraction from './ContractInteraction.vue'
const namespace = 'run'
@Component({
  components: {
    NodeAddressInput,
    ContractNameSelect,
    ContractInteraction,
  },
})
export default class Run extends Vue {
  @State('providerInstance', { namespace }) public providerInstance!: any
  @State('isPrivateKeySet', { namespace }) public isPrivateKeySet!: boolean
  @State('accountsLoading', { namespace }) public accountsLoading!: boolean
  @State('selectedAccount', { namespace }) public selectedAccount!: string
  @State('gasLimit', { namespace }) public gasLimit!: number
  @State('gasPrice', { namespace }) public gasPrice!: number
  @State('value', { namespace }) public value!: Value
  @State('contractArgs', { namespace }) public contractArgs!: string
  @Getter('getUnits', { namespace }) public getUnits!: object[]
  @Getter('contractNames', { namespace: 'compile' }) public contractNames!: string[]
  @Getter('parsedContractConstructor', { namespace: 'compile' }) public parsedContractConstructor!: ParsedContractConstructor
  @Getter('accounts', { namespace }) public accounts!: Account[]
  @Getter('getLatestContractAddress', { namespace }) public getLatestContractAddress!: string
  @Mutation('toggleAccountsLoading', { namespace }) public toggleAccountsLoading!: () => void
  @Mutation('saveValue', { namespace }) public saveValue!: (value: SaveValue) => void
  @Mutation('saveGasLimit', { namespace }) public saveGasLimit!: (gasLimit: number) => void
  @Mutation('saveGasPrice', { namespace }) public saveGasPrice!: (gasPrice: number) => void
  @Mutation('saveSelectAccount', { namespace }) public saveSelectAccount!: (account: string) => void
  @Mutation('setContractArgs', { namespace }) public setContractArgs!: (contractArgs: string) => void
  @Action('fetchAccounts', { namespace }) public fetchAccounts!: () => void
  @Action('compile', { namespace: 'compile' }) public compile!: () => void
  @Action('deploy', { namespace }) public deploy!: () => void
  @Action('retrieveContractFromAddress', { namespace }) public retrieveContractFromAddress!: (address: string) => void

  public fromAddressModel: string = ''
  public compileLoading: boolean = false
  public deployLoading: boolean = false
  public retrieveContractFromAddressLoading: boolean = false

  public async getAccounts(): Promise<void> {
    try {
      this.toggleAccountsLoading()
      await this.fetchAccounts()
    } catch (e) {
      await Notification.error({
        title: 'Error',
        message: `${e.message}${JSON.stringify(e)}`,
      })
      console.error(e)
    } finally {
      this.toggleAccountsLoading()
    }
  }
  public async handleCompile(): Promise<void> {
    this.compileLoading = true
    try {
      await this.compile()
    } catch (e) {
      await Notification.error({
        title: 'Error',
        message: `${e.message}${JSON.stringify(e)}`,
      })
      console.error(e)
    } finally {
      this.compileLoading = false
    }
  }
  public async handleDeploy(): Promise<void> {
    const deploy = async () => {
      try {
        this.deployLoading = true
        await this.deploy()
        await Notification.success({
          title: 'Success',
          message: `Contract deployed at ${this.getLatestContractAddress}`,
        })
      } catch (e) {
        await Notification.error({
          title: 'Error',
          message: `${e.message}${JSON.stringify(e)}`,
        })
        console.error(e)
      } finally {
        this.deployLoading = false
      }
    }
    if (!this.providerInstance) {
      await Notification.error({
        title: 'Error',
        message: 'Provider not set',
      })
    }
    if (await this.providerInstance.isMainnet()) {
      this.$confirm('You are trying to deploy to Mainnet. Continue?', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning',
      })
        .then(() => {
          deploy()
        })
        .catch(e => {})
    }
  }
  public async handleRetrieveContractFromAddress(): Promise<void> {
    this.retrieveContractFromAddressLoading = true
    try {
      await this.retrieveContractFromAddress(this.fromAddressModel)
    } catch (e) {
      await Notification.error({
        title: 'Error',
        message: `${e.message}${JSON.stringify(e)}`,
      })
      console.error(e)
    } finally {
      this.retrieveContractFromAddressLoading = false
    }
  }
  public set selectedAccountModel(account: string) {
    this.saveSelectAccount(account)
  }
  public get selectedAccountModel(): string {
    return this.selectedAccount
  }
  public set gasLimitModel(gasLimit: number) {
    this.saveGasLimit(gasLimit)
  }
  public get gasLimitModel(): number {
    return this.gasLimit
  }
  public set gasPriceModel(gasPrice: number) {
    this.saveGasPrice(gasPrice)
  }
  public get gasPriceModel(): number {
    return this.gasPrice
  }
  public set amountModel(amount: number) {
    this.saveValue({ amount })
  }
  public get amountModel(): number {
    return this.value.amount
  }
  public set unitModel(unit: string) {
    this.saveValue({ unit })
  }
  public get unitModel(): string {
    return this.value.unit
  }
  public set contractArgsModel(contractArgs: string) {
    this.setContractArgs(contractArgs)
  }
  public get contractArgsModel(): string {
    return this.contractArgs
  }
  public get constructorArgs() {
    return this.parsedContractConstructor()
  }
}
</script>

<style lang="stylus" scoped>
.el-row {
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
}
</style>