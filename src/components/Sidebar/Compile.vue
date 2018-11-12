<template>
  <div>
    <el-row>
      <el-col :span="18" :offset="3">
        <NodeAddressInput />
      </el-col>
    </el-row>
    
    <el-row>
      <el-col :span="18" :offset="3">
        <el-select v-model="selectedSolVersionModal" class="select" placeholder="Select new compiler version" style="display: block">
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
        <ContractNameSelect />
      </el-col>
    </el-row>
    
    <el-row>
      <el-col v-show="selectedContract !== ''" :span="24" :offset="13">
        <el-button type="primary" class="textColorBlack" @click="dialogAbiDetailsVisible = true">
          Details
        </el-button>
      </el-col>
    </el-row>
    
    <el-dialog :title="selectedContract" :visible.sync="dialogAbiDetailsVisible">
      {{ contractDetails() }}
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Action, Mutation, Getter, State } from 'vuex-class'
import NodeAddressInput from './NodeAddressInput.vue'
import ContractNameSelect from './ContractNameSelect.vue'
import { SolVersions, CompiledCode } from '../../store/types'
import {
    ContractByteCode,
    ContractAbi,
    ContractDetails,
} from '../../store/modules/sidebar/compile'


const namespace = 'compile'

@Component({
    components: {
        NodeAddressInput,
        ContractNameSelect
    }
})
export default class Compile extends Vue {
    @State('selectedContract', { namespace }) public selectedContract!: string
    @State('solVersions', { namespace }) public solVersions!: SolVersions
    @State('selectedSolVersion', { namespace }) public selectedSolVersion!: string

    @Getter('contractAbi', { namespace }) public contractAbi!: ContractAbi
    @Getter('contractDetails', { namespace }) public contractDetails!: ContractDetails

    @Mutation('setSolVersion', { namespace }) public setSolVersion!: (version: string) => void

    @Action('compile', { namespace }) public compile!: () => void
    @Action('fetchAccounts', { namespace: 'run' }) public fetchAccounts!: () => void

    public dialogAbiDetailsVisible: boolean = false
    public loading: boolean = false

    public async handleCompile(): Promise < void > {
        this.loading = true
        try {
            await this.compile()
        } catch (e) {
            throw e
        } finally {
            this.loading = false
        }
    }

    public set selectedSolVersionModal(solVersion: string) {
        this.setSolVersion(solVersion)
    }
    public get selectedSolVersionModal(): string {
        return this.selectedSolVersion
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