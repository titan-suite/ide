<template>
  <div>
    <el-table :data="formattedData" style="width: 100%">
      <el-table-column prop="key" label="Property" width="180" />
      <el-table-column prop="value" label="Value" width="600" />
    </el-table>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Action, Mutation, Getter, State } from 'vuex-class'

const namespace = 'run'
@Component
export default class Console extends Vue {

  @State('deployedContract', { namespace }) public deployedContract!: any

  public tableData: any = []

  get formattedData(): any {
    return this.convert(this.deployedContract.receipt)
  }

  public convert(d: any): any {
    const data = d ? Object.keys(d).map((j: any) => {
        return {
          key: j,
          value: d[j]
        }
      }) : []
    this.tableData.push(data)
    return data
  }

}
</script>
