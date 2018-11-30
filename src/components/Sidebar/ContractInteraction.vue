<template>
  <div style="margin-top: 20px;padding: 15px;">
    <el-collapse>
      <el-collapse-item
        v-for="(contract, index) in parsedContracts"
        :key="index"
        :title="contract.title"
        :name="'deployedContract' + index"
        :id="'deployedContract' + index"
      >
        <el-table :data="contract.abi" :show-header="false" style="width: 100%">
          <el-table-column>
            <template slot-scope="scope">
              <!-- {{ JSON.stringify(scope.row) }} -->
              <el-row type="flex">
                <el-col :offset="1" :span="scope.row.loading ? 8 : 7">
                  <el-button
                    :id="'deployedContract' + index + scope.row.name"
                    :loading="scope.row.loading"
                    style="width:100%"
                    class="secondaryButton"
                    type="primary"
                    @click="
                      scope.row.loading = true
                      handleFunctionCall(
                        scope.row,
                        contract.contractInstance,
                        contract.contractAddress
                      ).then((res) => {
                        scope.row.res = res
                        scope.row.loading = false
                      })
                    "
                  >{{ scope.row.name }}</el-button>
                </el-col>
                <el-col v-if="scope.row.inputs.length > 0" :span="scope.row.loading ? 12 : 13">
                  <el-popover
                    :content="scope.row.combinedInputs"
                    :open-delay="200"
                    placement="bottom-start"
                    width="50%"
                    trigger="focus"
                  >
                    <el-input
                      slot="reference"
                      :id="
                        'deployedContract' + index + scope.row.name + 'input'
                      "
                      v-model="scope.row.argsModel"
                      :placeholder="scope.row.combinedInputs"
                      clearable
                    />
                  </el-popover>
                </el-col>
              </el-row>
              <el-row>
                <p
                  v-for="(output, index) in scope.row.outputs"
                  v-show="scope.row.res"
                  :key="index"
                  type="flex"
                >
                  {{ index }} : {{ output.type }}:
                  {{ scope.row.res && scope.row.res[index] }}
                </p>
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
import { Mutation, State, Action } from 'vuex-class'
import * as web3Utils from 'web3-utils'
import { MethodAbi } from 'ethereum-types'
import { Notification } from 'element-ui'

const namespace = 'run'
@Component
export default class Console extends Vue {
  @State('deployedContracts', { namespace }) public deployedContracts!: Array<{
    abi: MethodAbi[];
    contractAddress: string;
    title: string;
  }>
  @State('isPrivateKeySet', { namespace }) public isPrivateKeySet!: boolean
  @State('privateKey', { namespace }) public privateKey!: { key: string; address: string }
  @State('providerInstance', { namespace }) public providerInstance!: any
  @State('selectedAccount', { namespace }) public selectedAccount!: string
  @State('gasLimit', { namespace }) public gasLimit!: number
  @State('value', { namespace }) public value!: { amount: number; unit: string }
  @Action('saveReceipt', { namespace }) public saveReceipt!: (receipt: any) => void

  public get parsedContracts() {
    return this.deployedContracts
  }

  public async handleFunctionCall(scope: any, contractInstance: any, contractAddress: string) {
    const parseType = (type: string, value: any) => {
      if (type.includes('byte')) {
        if (type.includes('[]')) {
          return value.map((i: string) => parseType('byte', i))
        }
        return web3Utils.toUtf8(value)
      }
      return value
    }

    try {
      if (this.providerInstance) {
        const data = [...JSON.parse(`[${scope.argsModel}]`)].map(i => `${i}`)
        let res: any
        if (scope.outputs.length < 1) {
          const txReceipt = await this.providerInstance.executeContractFunction({
            func: contractInstance.methods[scope.name](...data),
            from: this.selectedAccount,
            gas: this.gasLimit,
            value: web3Utils.fromWei(`${this.value.amount}`, 'ether'), // TODO check unit,
            privateKey: this.isPrivateKeySet ? this.privateKey.key : undefined,
          })
          this.saveReceipt(txReceipt)
          res = true
        } else {
          res = await contractInstance.methods[scope.name](...data).call({
            from: this.selectedAccount,
          })
          this.saveReceipt({ from: this.selectedAccount, to: contractAddress, data: res })
          return scope.outputs.length === 1
            ? [parseType(scope.outputs[0].type, res)]
            : scope.outputs.map(({ type }: any, index: number) => {
                return parseType(type, res[index])
              })
        }
      } else {
        throw new Error('Provider not set')
      }
    } catch (e) {
      await Notification.error({
        title: 'Error',
        message: `${e.message}${JSON.stringify(e)}`,
      })
      console.error(e)
    }
    return null
  }
}
</script>
