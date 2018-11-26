
<template>
  <div class="enableFocus" style="overflow:auto; width: 100%;padding: 15px;">
    <el-collapse>
      <el-collapse-item
        v-for="(receipt, index) in parsedReceipts"
        :key="index"
        :name="'transaction' + index"
        :id="'transaction' + index"
      >
        <template slot="title">
          {{ receipt.title }}
          <el-button
            type="primary"
            class="secondaryButton"
            icon="el-icon-tickets"
            circle
            style="padding: 5px;margin-left: 1rem;"
            @click="copyToClipboard(receipt.data)"
          />
        </template>
        <el-table :data="receipt.data" :show-header="false" style="width: 100%">
          <el-table-column prop="key" label="Property" width="140"/>
          <el-table-column label="Value">
            <template slot-scope="scope">
              {{ scope.row.value }}
              <el-button
                type="primary"
                class="secondaryButton"
                icon="el-icon-tickets"
                circle
                style="padding: 5px;margin-left: 1rem;"
                @click="copyToClipboard(scope.row.value)"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Action, Mutation, Getter, State } from 'vuex-class'
import { Notification } from 'element-ui'
const namespace = 'run'
@Component
export default class Console extends Vue {

    @State('receipts', { namespace }) public receipts!: any
    public $copyText: any
    public get parsedReceipts() {
        return this.receipts
    }
    public async copyToClipboard(data: any) {
        try {
            await this.$copyText(JSON.stringify(data))
            await Notification.success({
                title: 'Success',
                message: 'Copied to Clipboard',
                duration: 500
            })
        } catch (e) {
            await Notification.error({
                title: 'Error',
                message: 'Unable to Copy',
                duration: 10000
            })
            console.error(e)
        }
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