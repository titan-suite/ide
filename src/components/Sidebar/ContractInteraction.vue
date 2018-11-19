<template>
  <div style="margin-top: 20px;padding: 15px;">
    <el-collapse>
      <el-collapse-item
        v-for="(contract, index) in parsedContracts"
        :key="index"
        :title="contract.title"
        :name="contract.title"
      >
        <el-table :data="contract.abi" style="width: 100%">
          <el-table-column>
            <template slot-scope="scope">
              {{ JSON.stringify(scope.row) }}
              <el-row type="flex">
                <el-col :offset="1" :span="scope.row.loading ? 8 : 7">
                  <el-button
                    :loading="scope.row.loading"
                    style="width:100%"
                    class="secondaryButton"
                    type="primary"
                    @click="
                      scope.row.loading = true
                      scope.row.res = handleFunctionCall(
                        scope.row,
                        contract.title
                      )
                      scope.row.loading = false
                    "
                  >
                    {{ scope.row.name }}
                  </el-button>
                </el-col>
                <el-col
                  v-if="scope.row.inputs.length > 0"
                  :span="scope.row.loading ? 12 : 13"
                >
                  <!-- //TODO template variables -->
                  <el-popover
                    :content="handleCombineInput(scope.row.inputs)"
                    :open-delay="200"
                    placement="bottom-start"
                    width="50%"
                    trigger="focus"
                  >
                    <el-input
                      slot="reference"
                      v-model="scope.row.argsModel"
                      :placeholder="handleCombineInput(scope.row.inputs)"
                      clearable
                    />
                  </el-popover>
                </el-col>
                {{ scope.row.res }}
              </el-row>
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Action, Mutation, Getter, State } from 'vuex-class'
import { combineInputs, parseSignature } from '../../utils'
import * as web3Utils from 'web3-utils'
const namespace = 'run'
@Component
export default class Console extends Vue {
  @State('deployedContracts', { namespace }) public deployedContracts!: any[]
  @State('providerInstance', { namespace }) public providerInstance!: any
  @State('selectedAccount', { namespace }) public selectedAccount!: string
  @State('gasLimit', { namespace }) public gasLimit!: number
  @State('gasPrice', { namespace }) public gasPrice!: number

  public get parsedContracts() {
    return this.deployedContracts.map((contract: any) => {
      console.log(contract.abi)
      return {
        title: contract.contractAddress,
        abi: contract.abi.map((piece: any) => {
          return { ...piece, loading: false, argsModel: '', res: '' }
        })
      }
    })
  }

  public handleCombineInput(inputs: any[]) {
    return combineInputs(inputs)
  }

  public async handleFunctionCall(scope: any, to: string) {
    const parsedSignature = parseSignature(scope.name, scope.inputs)
    const hashedSignature = web3Utils
      .soliditySha3(parsedSignature)
      .substring(0, 10)
    const argsModel = web3Utils.padLeft(
      scope.argsModel
        .split(',')
        .map((arg: string) => web3Utils.toHex(arg).substring(2))
        .join(''),
      32
    )
    console.log({
      to,
      from: this.selectedAccount,
      scope,
      parsedSignature,
      hashedSignature,
      argsModel
    })
    let res
    if (scope.outputs.length < 1) {
      res = await this.providerInstance.sendTransaction({
        from: this.selectedAccount,
        to,
        data: hashedSignature + argsModel,
        gas: this.gasLimit
      })
      return res
    } else {
      res = await this.providerInstance.call({
        from: this.selectedAccount,
        to,
        data: hashedSignature + argsModel
      })
      res = web3Utils.hexToNumber(res)
    }
    console.log(res)
    return res
  }
}
</script>
