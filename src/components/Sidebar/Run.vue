<template>
  <div>
    <el-row>
      <el-col :span="4" :offset="3">
        <p>Environment</p>
      </el-col>
      <el-col :span="16" :offset="1">
        <el-select v-model="selectedContract" :disabled="loading || selectedContract === ''" class="select" placeholder="">
          <el-option v-for="name in contractNames" :key="name" :label="name" :value="name" />
        </el-select>
      </el-col>
    </el-row>
    <!-- <el-row>
                <el-col :span="24" :offset="10">
                    <el-button @click="dialogAbiDetailsVisible = true" :disabled="loading || selectedContract === ''">
                        Details
                    </el-button>
                </el-col>
            </el-row> -->
    <!-- <el-dialog :title="selectedContract" :visible.sync="dialogAbiDetailsVisible">
                {{getContractDetails()}}
            </el-dialog> -->
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Action, Getter, State } from 'vuex-class'
import { SolVersions } from '../../store/types'
import {
    ContractNames,
    ContractByteCode,
    ContractAbi,
    ContractDetails,
} from '../../store/modules/sidebar/compile'

const namespace = 'compile'
@Component
export default class Run extends Vue {

    @State('solVersions', { namespace }) public solVersions!: SolVersions
    @Getter('contractNames', { namespace }) public contractNames!: ContractNames
    @Getter('contractAbi', { namespace }) public contractAbi!: ContractAbi
    @Getter('contractDetails', { namespace }) public contractDetails!: ContractDetails
    @Action('compile', { namespace }) public compile!: (selectedVersion: string) => void

    public selectedVersion: string = ''
    public selectedContract: string = ''
    public dialogAbiDetailsVisible: boolean = false
    public loading: boolean = false

    public async handleCompile() {
        this.loading = true
        await this.compile(this.selectedVersion)
        this.selectedContract = this.contractNames[0]
        this.loading = false
    }

    public getContractDetails() {
        return this.contractDetails(this.selectedContract)
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