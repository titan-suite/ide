<template>
  <div>
    <el-row :gutter="11">
      <el-col :span="7" :offset="1">
        <p>Provider URL</p>
      </el-col>
      <el-col :span="13">
        <NodeAddressInput />
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="7" :offset="1">
        <p>Compiler Version</p>
      </el-col>
      <el-col :span="13">
        <el-select v-model="selectedSolVersionModal" class="select" style="display: block">
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
      <el-col :span="23" :offset="1" style="padding-right:1rem">
        <h3>Problems ({{ lintDetails.length }})</h3>
        <el-collapse v-model="activeName" accordion>
          <el-collapse-item v-for="(report, index) in lintDetails" :key="index" :title="`line ${report.line} column ${report.column} - ${report.ruleId}`" :name="index" class="lint-report" style="overflow:hidden">
            <el-row style="margin-top:1rem">
              <el-col :span="23" :offset="1">
                <i v-if="report.severity === 2" class="el-icon-warning warning" />
                <i v-if="report.severity === 3" class="el-icon-warning danger" />
              </el-col>
              <el-col :span="23" :offset="1">
                <p>{{ report.message }} </p>
              </el-col>
            </el-row>
          </el-collapse-item>
        </el-collapse>
      </el-col>
    </el-row>

    <el-dialog :title="selectedContract" :visible.sync="dialogAbiDetailsVisible" width="80%">
      <tree-view :data="contractDetails()" :options="{maxDepth: 4}" />
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Action, Mutation, Getter, State } from 'vuex-class'
import NodeAddressInput from './NodeAddressInput.vue'
import ContractNameSelect from './ContractNameSelect.vue'
import { SolVersions, CompiledCode, File } from '../../store/types'
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

    @Getter('activeFile', { namespace: 'workspace' }) public activeFile!: File
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
        const code = this.activeFile.code
        const { reports } = linter.processStr(code, configAsJson)
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

.danger {
  color: #fff;
  background-color: #f56c6c;
  border-color: #f56c6c;
  border-radius: 50%;
  padding: 6px;
}

.warning {
  color: #fff;
  background-color: #e6a23c;
  border-color: #e6a23c;
  border-radius: 50%;
  padding: 6px;
}
</style>