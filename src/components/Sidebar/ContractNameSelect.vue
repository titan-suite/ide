<template>
  <el-select :id="id+'SelectContract'" v-model="selectedContractModel" class="select" placeholder="Choose a Contract" style="display: block">
    <el-option v-for="name in contractNames" :key="name" :label="name" :value="name" class="contractNameOption"/>
  </el-select>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Mutation, State, Getter } from 'vuex-class'
const namespace = 'compile'
@Component
export default class ContractNameSelect extends Vue {

    @Prop(String) public id!: string
    @State('selectedContract', { namespace }) public selectedContract!: string
    @Getter('contractNames', { namespace }) public contractNames!: string[]
    @Mutation('setSelectedContract', { namespace }) public setSelectedContract!: (contractName: string) => void

    public set selectedContractModel(contractName: string) {
        this.setSelectedContract(contractName)
    }
    public get selectedContractModel(): string {
        return this.selectedContract
    }
}
</script>

<style lang="stylus" scoped>
.el-row {
    margin-bottom: 20px;

    &:last-child {
        margin-bottom: 0;
    }
}
</style>