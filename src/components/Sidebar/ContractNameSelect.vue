<template>
  <el-select v-model="selectedContractModel" class="select" placeholder="Choose a Contract" style="display: block">
    <el-option v-for="name in contractNames" :key="name" :label="name" :value="name" />
  </el-select>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Mutation, State, Getter } from 'vuex-class'
import {  ContractNames } from '../../store/modules/sidebar/compile'
const namespace = 'compile'
@Component
export default class ContractNameSelect extends Vue {

    @State('selectedContract', { namespace }) public selectedContract!: string
    @Getter('contractNames', { namespace }) public contractNames!: ContractNames
    @Mutation('setSelectedContract', { namespace }) public setSelectedContract!: (contractName: string) => void

    public set selectedContractModel(contractName: string) {
        this.setSelectedContract(contractName)
    }
    public get selectedContractModel(): string {
        return this.selectedContract
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
</style>