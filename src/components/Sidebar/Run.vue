<template>
  <div>
    <el-row :gutter="11">
      <el-col :span="7" :offset="1">
        <p>Provider Url</p>
      </el-col>
      <el-col :span="13">
        <NodeAddressInput />
      </el-col>
    </el-row>
    
    <el-row :gutter="11">
      <el-col :span="7" :offset="1">
        <p>Account</p>
      </el-col>
      <el-col :span="13">
        <el-select v-model="selectedAccountModel" :loading="accountsLoading" class="select" placeholder="Choose an Account" style="display: block">
          <el-option v-for="account in accounts" :key="account.address" :label="account.label" :value="account.address" />
        </el-select>
      </el-col>
      <el-col :span="2">
        <el-button :loading="accountsLoading" type="primary" size="mini" icon="el-icon-refresh" circle style="margin-top:0.69rem" @click="getAccounts" />
      </el-col>
    </el-row>
    
    <el-row>
      <el-col :span="7" :offset="1">
        <p>Password</p>
      </el-col>
      <el-col :span="13">
        <el-input v-model="accountPasswordModel" :value="accountPassword" type="password" clearable />
      </el-col>
    </el-row>
    
    <el-row>
      <el-col :span="7" :offset="1">
        <p>Gas Limit</p>
      </el-col>
      <el-col :span="13">
        <el-input v-model="gasLimitModel" :value="gasLimit" type="number" clearable />
      </el-col>
    </el-row>
    
    <el-row :gutter="11">
      <el-col :span="7" :offset="1">
        <p>Value</p>
      </el-col>
      <el-col :span="7">
        <el-input v-model="amountModel" :value="value.amount" type="number" clearable />
      </el-col>
      <el-col :span="6">
        <el-select v-model="unitModel" class="select" placeholder="Unit" style="display: block">
          <el-option v-for="unit in units" :key="unit.value" :label="unit.label" :value="unit.value" />
        </el-select>
      </el-col>
    </el-row>
    
    <el-row :gutter="11">
      <el-col :span="20" :offset="1">
        <ContractNameSelect />
      </el-col>
      <el-col :span="3">
        <el-button :loading="compileLoading" type="primary" size="mini" icon="el-icon-refresh" circle style="margin-top:0.69rem" @click="handleCompile" />
      </el-col>
    </el-row>
    
    <el-row>
      <el-col :offset="1" :span="deployLoading ? 8: 7">
        <el-button :loading="deployLoading" style="width:100%" type="primary" class="textColorBlack" @click="handleDeploy">
          Deploy
        </el-button>
      </el-col>
    </el-row>
    
    <el-row style="margin-top:-20px;margin-bottom:0px">
      <el-col :offset="3">
        <p>or</p>
      </el-col>
    </el-row>
    
    <el-row type="flex">
      <el-col :offset="1" :span="deployLoading ? 8: 7">
        <el-button :loading="deployLoading" style="width:100%" class="secondaryButton" type="primary" @click="handleDeploy(true, fromAddressModel)">
          At Address
        </el-button>
      </el-col>
      <el-col :span="deployLoading ? 12: 13">
        <el-input v-model="fromAddressModel" placeholder="Load contract from Address" clearable />
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Action, Mutation, Getter, State } from 'vuex-class'
import { SolVersions, Account, Value, Unit } from '../../store/types'
import { ContractNames } from '../../store/modules/sidebar/compile'
import { SaveValue , Deploy} from '../../store/modules/sidebar/run'
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

    @State('accountsLoading', { namespace }) public accountsLoading!: boolean
    @State('selectedAccount', { namespace }) public selectedAccount!: string
    @State('gasLimit', { namespace }) public gasLimit!: number
    @State('value', { namespace }) public value!: Value
    @State('units', { namespace }) public units!: Unit[]
    @State('accountPassword', { namespace }) public accountPassword!: string
    @Getter('contractNames', { namespace: 'compile' }) public contractNames!: ContractNames
    @Getter('accounts', { namespace }) public accounts!: Account[]
    @Mutation('toggleAccountsLoading', { namespace }) public toggleAccountsLoading!: () => void
    @Mutation('saveValue', { namespace }) public saveValue!: (value: SaveValue) => void
    @Mutation('saveGasLimit', { namespace }) public saveGasLimit!: (gasLimit: number) => void
    @Mutation('setNodeStatus', { namespace: 'compile' }) public setNodeStatus!: (status: boolean) => void
    @Mutation('saveSelectAccount', { namespace }) public saveSelectAccount!: (account: string) => void
    @Mutation('saveAccountPassword', { namespace }) public saveAccountPassword!: (password: string) => void
    @Action('fetchAccounts', { namespace }) public fetchAccounts!: () => void
    @Action('compile', { namespace: 'compile' }) public compile!: () => void
    @Action('deploy', { namespace }) public deploy!: Deploy


    public fromAddressModel: string = ''
    public compileLoading: boolean = false
    public deployLoading: boolean = false

    public async getAccounts(): Promise < void > {
        console.log('fetching Accounts')
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
    public async handleDeploy(fromAddress: boolean=false, address: string = ''): Promise < void > {
        console.log('deploying')
        this.deployLoading = true
        try {
            await this.deploy({fromAddress, address})
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