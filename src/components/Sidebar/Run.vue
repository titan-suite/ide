<template>
  <div>
    <NodeAddressInput />
    <el-row :gutter="11">
      <el-col :span="18" :offset="3">
        <el-select v-model="selectedAccountModel" :loading="loading" class="select" placeholder="Choose an Account" style="display: block">
          <el-option v-for="account in accounts" :key="account.address" :label="account.label" :value="account.address" />
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-button :loading="loading" type="primary" size="mini" icon="el-icon-refresh" circle style="margin-top:0.69rem" @click="getAccounts" />
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Action, Mutation, Getter, State } from 'vuex-class'
import { SolVersions, Account } from '../../store/types'
import { ContractNames } from '../../store/modules/sidebar/compile'
  import NodeAddressInput from './NodeAddressInput.vue'
const namespace = 'run'
      @Component({
        components: {
          NodeAddressInput
        }
      })
export default class Run extends Vue {

    @State('selectedAccount', { namespace }) public selectedAccount!: string
    @Getter('contractNames', { namespace:'compile' }) public contractNames!: ContractNames
    @Getter('accounts', { namespace }) public accounts!: Account[]
    @Mutation('setNodeStatus', { namespace:'compile' }) public setNodeStatus!: (status:boolean) => void
    @Mutation('saveSelectAccount', { namespace }) public saveSelectAccount!: (account:string) => void
    @Action('fetchAccounts', { namespace }) public fetchAccounts!: () => void

    public loading: boolean = false

    public async getAccounts(): Promise <void> {
        console.log('fetching Accounts')
        this.loading = true
        this.setNodeStatus(true)// TODO validate node and then fetch 
        await this.fetchAccounts()
        this.loading = false
    }
    public set selectedAccountModel(value: string) {
        this.saveSelectAccount(value)
    }
    public get selectedAccountModel(): string {
        return this.selectedAccount
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