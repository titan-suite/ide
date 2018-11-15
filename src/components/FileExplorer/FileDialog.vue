<template>
  <el-dialog :visible.sync="dialogFormVisible" :close-on-click-modal="false" :close-on-press-escape="false" title="New Smart Contract">

    <el-form ref="form" :model="form">
      <el-form-item :label-width="formLabelWidth" label="Name">
        <el-input v-model="form.name" />
      </el-form-item>

      <el-form-item :label-width="formLabelWidth" label="Language">
        <el-select v-model="form.language" placeholder="Please select a language">
          <el-option label="Solidity" value="solidity" />
          <el-option label="SolidityX" value="solidityx" />
          <el-option label="Vyper" value="vyper" />
          <el-option label="Java" value="java" />
        </el-select>
      </el-form-item>

      <el-form-item :label-width="formLabelWidth" label="Compiler Version">
        <el-select v-model="form.compiler" placeholder="Please select a version">
          <el-option label="v0.4.9" value="sol-v049" />
          <!-- <el-option label="v0.4.15" value="sol-v0415" /> -->
        </el-select>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button class="secondaryButton" type="primary" @click="$emit('dialogFormVisible', false)">Cancel</el-button>
      <el-button type="primary" @click="handleFormSubmit">Confirm</el-button>
    </span>
  </el-dialog>
</template>


<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator'
  import { State, Mutation, Getter, Action } from 'vuex-class'
  import { EditorOptions, File, Folder } from '../../store/types'
  const namespace = 'workspace'

  @Component
  export default class FileDialog extends Vue {
    @Prop(Boolean) public dialogFormVisible!: boolean
    @Action('addFile', { namespace }) public addFile: any    

    public form: any = {
        name: '',
        language: '',
        compiler: ''
    }
    public formLabelWidth: string = '200px'

    public handleFormSubmit(d: any): void {
        const { form: theForm } = this.$refs
        this.addFile(this.form.name)
        this.$emit('dialogFormVisible', false)
    }
    
  }
</script>