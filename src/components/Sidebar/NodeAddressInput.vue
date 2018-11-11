<template>
  <el-row>
    <el-col :span="18" :offset="3">
      <el-input v-model="nodeAddressModel" :value="nodeAddress" placeholder="Web3 Provider Url" clearable>
        <!-- <template slot="prepend">Http://</template>-->
      </el-input>
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Mutation, State } from 'vuex-class'
const namespace = 'compile'
@Component
export default class Compile extends Vue {

    @State('nodeAddress', { namespace }) public nodeAddress!: string
    @Mutation('saveNodeAddress', { namespace }) public saveNodeAddress!: (nodeAddress: string) => void
   
   public set nodeAddressModel(value: string) {
        this.saveNodeAddress(value)
    }
    public get nodeAddressModel(): string {
        return this.nodeAddress
    }
}
</script>