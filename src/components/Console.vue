<template>
  <div class="enableFocus" style="overflow:auto; width: 100%;padding: 15px;">
    <el-collapse>
      <el-collapse-item v-for="(receipt, index) in parsedReceipts" :key="index" :title="receipt.title" :name="receipt.title">
        <el-table :data="receipt.data" :show-header="false" style="width: 100%">
          <el-table-column prop="key" label="Property" width="180" />
          <el-table-column prop="value" label="Value" width="600" />
        </el-table>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Action, Mutation, Getter, State } from 'vuex-class'
const namespace = 'run'
@Component
export default class Console extends Vue {

    @State('receipts', { namespace }) public receipts!: any

    public get parsedReceipts() {
        return this.receipts
    }
}
</script>

<style lang="stylus" scoped>
.el-row {
  margin-bottom: 20px;
  border-bottom: 1px solid #82848a;

  &:last-child {
    margin-bottom: 0;
  }
}
</style>