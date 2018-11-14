<template>
  <div style="overflow:scroll">
    <el-row v-for="(receipt, index) in receipts" :key="index">
      <el-col :span="24">
        <el-table :data="parsedReceipt(receipt)" style="width: 100%">
          <el-table-column prop="key" label="Property" width="180" />
          <el-table-column prop="value" label="Value" width="600" />
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Action, Mutation, Getter, State } from 'vuex-class'

const namespace = 'run'
@Component
export default class Console extends Vue {

  @State('receipts', { namespace }) public receipts!: any
  
  public parsedReceipt(receipt: any) {
    return Object.keys(receipt).map((j: any) => {
          return {
            key: j,
            value: receipt[j]
          }
        })
  }

}
</script>
