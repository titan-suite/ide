<template>
  <div style="margin-top: 20px;padding: 15px;">
    <el-collapse>
      <el-collapse-item
        v-for="(contract, index) in parsedContracts"
        :key="index"
        :title="contract.title"
        :name="contract.contractAddress"
      >
        <el-table :data="contract.abi" :show-header="false" style="width: 100%">
          <el-table-column>
            <template slot-scope="scope">
              <!-- {{ JSON.stringify(scope.row) }} -->

              <el-row type="flex">
                <el-col :offset="1" :span="scope.row.loading ? 8 : 7">
                  <el-button
                    :loading="scope.row.loading"
                    style="width:100%"
                    class="secondaryButton"
                    type="primary"
                    @click="
                      scope.row.loading = true
                      handleFunctionCall(
                        scope.row,
                        contract.contractAddress
                      ).then((res) => {
                        scope.row.res = res
                        scope.row.loading = false
                      })
                    "
                  >
                    {{ scope.row.name }}
                  </el-button>
                </el-col>
                <el-col
                  v-if="scope.row.inputs.length > 0"
                  :span="scope.row.loading ? 12 : 13"
                >
                  <el-popover
                    :content="scope.row.combinedInputs"
                    :open-delay="200"
                    placement="bottom-start"
                    width="50%"
                    trigger="focus"
                  >
                    <el-input
                      slot="reference"
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
import { Mutation, State } from 'vuex-class'
import { parseSignature, hashArgs } from '../../utils'
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
  @State('providerInstance', { namespace }) public providerInstance!: any
  @State('selectedAccount', { namespace }) public selectedAccount!: string
  @State('gasLimit', { namespace }) public gasLimit!: number
  @Mutation('saveReceipt', { namespace }) public saveReceipt!: (
    receipt: any
  ) => void

  public get parsedContracts() {
    return this.deployedContracts
  }

  public async handleFunctionCall(scope: any, to: string) {
    try {
      if (this.providerInstance) {
        const parsedSignature = scope.parsedSignature
        const hashedSignature = scope.hashedSignature
        const hashedArgs = hashArgs(scope.argsModel)
        // const parsedArgs = [...JSON.parse(`[${scope.argsModel}]`)]
        // if (scope.inputs.length !== parsedArgs.length) {
        //   throw new Error('Invalid Args')
        // }
        // const hashedArgs = web3Utils.padLeft(
        //   parsedArgs
        //     .map((arg: string | any[], index: number) => {
        //       if (
        //         scope.inputs[index].type.includes('[]') &&
        //         typeof arg === 'object'
        //       ) {
        //         console.log('[] input')
        //         const arrayLength = web3Utils.toHex(arg.length).substring(2)
        //         const arrayElementsHash = arg
        //           .map((element) => web3Utils.toHex(element).substring(2))
        //           .join('')
        //         return arrayLength + arrayElementsHash
        //       }
        //       return web3Utils.toHex(arg).substring(2)
        //     })
        //     .join(''),
        //   32
        // )
        const data = hashedSignature + hashedArgs
        if (process.env.NODE_ENV !== 'production') {
          console.log({
            to,
            from: this.selectedAccount,
            scope,
            parsedSignature,
            hashedSignature,
            hashedArgs,
            data,
            gas: this.gasLimit
          })
        }
        let res: any
        if (scope.outputs.length < 1) {
          const txhash = await this.providerInstance.sendTransaction({
            from: this.selectedAccount,
            to,
            data,
            gas: this.gasLimit
          })
          if (!txhash) {
            throw new Error('Transaction Failed')
          }
          const receipt = await this.providerInstance.getReceiptWhenMined(
            txhash
          )
          this.saveReceipt(receipt)
          res = true
        } else {
          res = await this.providerInstance.call({
            from: this.selectedAccount,
            to,
            data
          })
          res = res.substring(2)
          console.dir(res)
          const NUMBER = 'number'
          const STRING = 'string'
          const cutFromHex = (targetType: string) => {
            let targetString
            if (targetType === NUMBER) {
              targetString = res.substring(0, 32)
            } else if (targetType === STRING) {
              targetString = res.substring(0, 64)
            }
            res = res.substring(targetString.length)
            return targetString
          }
          res = scope.outputs.map(({ type }: any) => {
            if (type.includes('int')) {
              if (type.includes('[]')) {
                cutFromHex(NUMBER)
                const parsedLengthOfArray = Number(
                  web3Utils.hexToNumber(`0x${cutFromHex(NUMBER)}`)
                )
                return [...Array(parsedLengthOfArray).keys()].map(() =>
                  web3Utils.hexToNumber(`0x${cutFromHex(NUMBER)}`)
                )
              }
              return web3Utils.hexToNumber(`0x${cutFromHex(NUMBER)}`)
            } else if (type.includes('byte')) {
              if (type.includes('[]')) {
                console.log({ res })
                // cutFromHex(NUMBER)
                // const parsedLengthOfArray = Number(
                //   web3Utils.hexToNumber(`0x${cutFromHex(STRING)}`)
                // )
                // return [...Array(parsedLengthOfArray).keys()].map(() =>
                //   web3Utils.hexToNumber(`0x${cutFromHex(STRING)}`)
                // )
                return []
              }
              return web3Utils.hexToUtf8(`0x${cutFromHex(STRING)}`)
            } else if (type.includes('address')) {
              return `0x${res}`
            }
          })
        }
        return res
      } else {
        throw new Error('Provider not set')
      }
    } catch (e) {
      await Notification.error({
        title: 'Error',
        message: `${e.message}${JSON.stringify(e)}`
      })
      console.error(e)
    }
    return null
  }
}
</script>
