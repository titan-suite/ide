<template>
    <el-button @click="handleCompile">
        Compile
    </el-button>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Action } from 'vuex-class'
const namespace: string = 'sidebar'
@Component
export default class Compile extends Vue {
    @Action('compile', { namespace }) public compile: any
    public mounted(): void {
        console.log('Compile Mounted')
    }
    public async handleCompile() {
        await this.compile()
    }
}
</script>
