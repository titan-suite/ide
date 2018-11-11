<template>

    <!-- <el-button type="text" @click="dialogFormVisible = true">open a Form nested Dialog</el-button> -->

    <el-dialog title="New Smart Contract" :visible.sync="dialogFormVisible">

        <el-form :model="form">
            <el-form-item label="Name" :label-width="formLabelWidth">
                <el-input v-model="form.name"></el-input>
            </el-form-item>

            <el-form-item label="Language" :label-width="formLabelWidth">
                <el-select v-model="form.language" placeholder="Please select a programming language">
                    <el-option label="Solidity" value="solidity"></el-option>
                    <el-option label="SolidityX" value="solidityx"></el-option>
                    <el-option label="Vyper" value="vyper"></el-option>
                    <el-option label="Java" value="java"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="Compiler Version" :label-width="formLabelWidth">
                <el-select v-model="form.compiler" placeholder="Please select a version">
                    <el-option label="v0.4.9" value="sol-v049"></el-option>
                    <el-option label="v0.4.15" value="sol-v0415"></el-option>
                </el-select>
            </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
            <el-button @click="visible = false">Cancel</el-button>
            <el-button type="primary" @click="visible = false">Confirm</el-button>
        </span>
    </el-dialog>

</template>


<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator'
  import { State, Mutation, Getter } from 'vuex-class'
  import { EditorOptions, ActiveFile, File, Folder } from '../../store/types'
  const namespace: string = 'workspace'

  @Component
  export default class FileDialog extends Vue {
    @Prop(Boolean) public dialogFormVisible!: boolean
    

    public form: object = {
        name: '',
        language: '',
        compiler: ''
    }
    public formLabelWidth: string = '120px'
    private visible: boolean = this.dialogFormVisible

    public mounted(): void {
        console.log('FileDialog mounted', this.visible, this.dialogFormVisible)
    }

    get hide() {
        this.visible = false
        console.log('attempting to hide', this.visible, this.dialogFormVisible)
        this.$emit('dialogFormVisible', this.visible)
        console.log('attempting to hide', this.visible, this.dialogFormVisible)
        return this.visible
    }
    
  }
</script>