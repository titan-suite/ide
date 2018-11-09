<template>
    <div>
        <el-row>
            <el-col :span="18" :offset="3">
                <el-select v-model="selectedVersion" class="select" placeholder="Select new compiler version">
                    <el-option v-for="version in solVersions" :key="version.value" :label="version.label" :value="version.value">
                    </el-option>
                </el-select>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24" :offset="8">
                <el-button @click="handleCompile">
                    Start to Compile
                </el-button>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
                {{contracts}}
            </el-col>
            <el-col :span="24">
                {{contractDetails}}
            </el-col>
        </el-row>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Action, Getter, State } from 'vuex-class'
import { SolVersions } from '../../store/types'
import { ContractAbi } from 'ethereum-types'

const namespace: string = 'compile'
@Component
export default class Compile extends Vue {
    @State('solVersions', { namespace }) public solVersions!: SolVersions
    @Getter('contracts', { namespace }) public contracts!: string[]
    @Getter('contractDetails', { namespace }) public contractDetails!: ContractAbi
    @Action('compile', { namespace }) public compile: any
    public selectedVersion: string = ''
    public mounted(): void {
        console.log('Compile Mounted', this.solVersions)
    }
    public async handleCompile() {
        await this.compile(this.selectedVersion)
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

.select {
    display: block !important;
}
</style>