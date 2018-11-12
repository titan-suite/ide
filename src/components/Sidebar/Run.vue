<template>
  <div>
    <el-row>
      <el-col :span="18" :offset="3">
        <NodeAddressInput />
      </el-col>
    </el-row>
    
    <el-row :gutter="11">
      <el-col :span="18" :offset="3">
        <el-select v-model="selectedAccountModel" :loading="accountFetchLoading" class="select" placeholder="Choose an Account" style="display: block">
          <el-option v-for="account in accounts" :key="account.address" :label="account.label" :value="account.address" />
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-button :loading="accountFetchLoading" type="primary" size="mini" icon="el-icon-refresh" circle style="margin-top:0.69rem" @click="getAccounts" />
      </el-col>
    </el-row>
    
    <el-row>
      <el-col :span="18" :offset="3">
        <el-input v-model="accountPasswordModel" :value="accountPassword" type="password" placeholder="Account Password" clearable />
      </el-col>
    </el-row>
    
    <el-row>
      <el-col :span="18" :offset="3">
        <el-input v-model="gasLimitModel" :value="gasLimit" type="number" placeholder="Gas Limit" clearable />
      </el-col>
    </el-row>
    
    <el-row :gutter="11">
      <el-col :span="12" :offset="3">
        <el-input v-model="amountModel" :value="value.amount" type="number" placeholder="Value" clearable />
      </el-col>
      <el-col :span="6">
        <el-select v-model="unitModel" class="select" placeholder="Unit" style="display: block">
          <el-option v-for="unit in units" :key="unit.value" :label="unit.label" :value="unit.value" />
        </el-select>
      </el-col>
    </el-row>
    
    <el-row :gutter="11">
      <el-col :span="18" :offset="3">
        <ContractNameSelect />
      </el-col>
      <el-col :span="3">
        <el-button :loading="compileLoading" type="primary" size="mini" icon="el-icon-refresh" circle style="margin-top:0.69rem" @click="handleCompile" />
      </el-col>
    </el-row>
    
    <el-row>
      <el-col :span="24" :offset="13">
        <el-button :loading="deployLoading" type="primary" class="textColorBlack" @click="handleDeploy">
          Deploy
        </el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Action, Mutation, Getter, State } from 'vuex-class'
import { SolVersions, Account, Value, Unit } from '../../store/types'
import { ContractNames } from '../../store/modules/sidebar/compile'
import { SaveValue } from '../../store/modules/sidebar/run'
import NodeAddressInput from './NodeAddressInput.vue'
import ContractNameSelect from './ContractNameSelect.vue'


const namespace = 'run'
@Component({
    components: {
        NodeAddressInput,
        ContractNameSelect
    }
})
export default class Run extends Vue {

    @State('selectedAccount', { namespace }) public selectedAccount!: string
    @State('gasLimit', { namespace }) public gasLimit!: number
    @State('value', { namespace }) public value!: Value
    @State('units', { namespace }) public units!: Unit[]
    @State('accountPassword', { namespace }) public accountPassword!: string
    @Getter('contractNames', { namespace: 'compile' }) public contractNames!: ContractNames
    @Getter('accounts', { namespace }) public accounts!: Account[]
    @Mutation('saveValue', { namespace }) public saveValue!: (value: SaveValue) => void
    @Mutation('saveGasLimit', { namespace }) public saveGasLimit!: (gasLimit: number) => void
    @Mutation('setNodeStatus', { namespace: 'compile' }) public setNodeStatus!: (status: boolean) => void
    @Mutation('saveSelectAccount', { namespace }) public saveSelectAccount!: (account: string) => void
    @Mutation('saveAccountPassword', { namespace }) public saveAccountPassword!: (password: string) => void
    @Action('fetchAccounts', { namespace }) public fetchAccounts!: () => void
    @Action('compile', { namespace: 'compile' }) public compile!: () => void
    @Action('deploy', { namespace }) public deploy!: () => void


    public accountFetchLoading: boolean = false
    public compileLoading: boolean = false
    public deployLoading: boolean = false

    public async getAccounts(): Promise < void > {
        console.log('fetching Accounts')
        try {
            this.accountFetchLoading = true
            this.setNodeStatus(true) // TODO validate node and then fetch 
            await this.fetchAccounts()
        } catch (e) {
            throw e
        } finally {
            this.accountFetchLoading = false
        }
    }
    public async handleCompile(): Promise < void > {
        console.log('compiling')
        this.compileLoading = true
        try {
            await this.compile()
        } catch (e) {
            throw e
        } finally {
            this.compileLoading = false
        }
    }
    public async handleDeploy(): Promise < void > {
        console.log('compiling')
        this.deployLoading = true
        try {
            await this.deploy()
        } catch (e) {
            throw e
        } finally {
            this.deployLoading = false
        }
    }
    public set selectedAccountModel(value: string) {
        this.saveSelectAccount(value)
    }
    public get selectedAccountModel(): string {
        return this.selectedAccount
    }
    public set accountPasswordModel(password: string) {
        this.saveAccountPassword(password)
    }
    public get accountPasswordModel(): string {
        return this.accountPassword
    }
    public set gasLimitModel(gasLimit: number) {
        this.saveGasLimit(gasLimit)
    }
    public get gasLimitModel(): number {
        return this.gasLimit
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
}
</script>

<style lang="stylus">
.el-row {
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
}
</style>