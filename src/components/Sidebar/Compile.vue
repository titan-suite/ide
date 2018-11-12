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

    <el-row>
      <el-col :span="24">
        <h3>Problems ({{ lintDetails.length }})</h3>
        <el-collapse v-model="activeName" accordion>
          <el-collapse-item v-for="(report, index) in lintDetails" :key="index" :title="`line ${report.line} column ${report.column} - ${report.ruleId}`" :name="index" class="lint-report">
            <span v-if="report.severity === 2">
              <el-button type="warning" circle><i class="el-icon-warning"></i></el-button>
            </span>
            <span v-if="report.severity === 3">
              <el-button type="danger" circle><i class="el-icon-warning"></i></el-button>
            </span>
            <!-- <br> -->
            <span> {{ report.message }}</span>
          </el-collapse-item>
        </el-collapse>
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

import linter from 'solhint/lib/index'

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

    @Getter('activeFileCode', { namespace: 'workspace' }) public activeFileCode!: string
    @Getter('contractAbi', { namespace }) public contractAbi!: ContractAbi
    @Getter('contractDetails', { namespace }) public contractDetails!: ContractDetails

    @Mutation('setSolVersion', { namespace }) public setSolVersion!: (version: string) => void

    @Action('compile', { namespace }) public compile!: () => void
    @Action('fetchAccounts', { namespace: 'run' }) public fetchAccounts!: () => void

    public dialogAbiDetailsVisible: boolean = false
    public loading: boolean = false
    public activeName: string = '1'

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
    public get lintDetails(): string {
      const configAsJson = {
        extends: 'default',
        rules: {
            'avoid-throw': false,
            'compiler-fixed': true,
            'avoid-suicide': 'error',
            'avoid-sha3': 'warn',
            indent: true,
            'payable-fallback': false
        }
      }
      const code = this.activeFileCode
      console.log(code)
      const {reports} = linter.processStr(code, configAsJson)
      console.log(reports)
      return reports
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