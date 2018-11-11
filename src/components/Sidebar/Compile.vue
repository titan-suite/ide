<template>
  <div>
    <el-row>
      <el-col :span="18" :offset="3">
        <el-input v-model="nodeAddressModel" :value="nodeAddress" placeholder="Web3 Provider Url" clearable>
          <!-- <template slot="prepend">Http://
</template>-->
        </el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="18" :offset="3">
        <el-select v-model="selectedVersion" class="select" placeholder="Select new compiler version">
          <el-option v-for="version in solVersions" :key="version.value" :label="version.label" :value="version.value" />
        </el-select>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24" :offset="10">
        <el-button :loading="loading" type="primary" class="textColorBlack" @click="handleCompile">
          Start to Compile
        </el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col v-show="selectedContract !== ''" :span="18" :offset="3">
        <el-select v-model="selectedContract" class="select" placeholder="">
          <el-option v-for="name in contractNames" :key="name" :label="name" :value="name" />
        </el-select>
      </el-col>
    </el-row>
    <el-row>
      <el-col v-show="selectedContract !== ''" :span="24" :offset="10">
        <el-button type="primary" class="textColorBlack" @click="dialogAbiDetailsVisible = true">
          Details
        </el-button>
      </el-col>
    </el-row>

    <el-dialog :title="selectedContract" :visible.sync="dialogAbiDetailsVisible">
      {{ getContractDetails() }}
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Action, Mutation, Getter, State } from 'vuex-class'
import { SolVersions, CompiledCode } from '../../store/types'
import {
    ContractNames,
    ContractByteCode,
    ContractAbi,
    ContractDetails,
} from '../../store/modules/sidebar/compile'

const namespace = 'compile'
@Component
export default class Compile extends Vue {

    @State('nodeAddress', { namespace }) public nodeAddress!: string
    @State('solVersions', { namespace }) public solVersions!: SolVersions
    @Getter('contractNames', { namespace }) public contractNames!: ContractNames
    @Getter('contractAbi', { namespace }) public contractAbi!: ContractAbi
    @Getter('contractDetails', { namespace }) public contractDetails!: ContractDetails
    @Action('compile', { namespace }) public compile!: (selectedVersion: string) => void
    @Mutation('saveNodeAddress', { namespace }) public saveNodeAddress!: (nodeAddress: string) => void

    public selectedVersion: string = ''
    public selectedContract: string = ''
    public dialogAbiDetailsVisible: boolean = false
    public loading: boolean = false

    public async handleCompile(): Promise < void > {
        this.loading = true
        await this.compile(this.selectedVersion)
        this.selectedContract = this.contractNames[0]
        this.loading = false
    }

    public getContractDetails(): CompiledCode {
        return this.contractDetails(this.selectedContract)
    }
    public set nodeAddressModel(value: string) {
        this.saveNodeAddress(value)
    }
    public get nodeAddressModel(): string {
        return this.nodeAddress
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

.select {
  display: block !important;
}
</style>