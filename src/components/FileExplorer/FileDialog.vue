<template>
  <el-dialog :visible.sync="isVisible" title="New Smart Contract">
    <el-form ref="form" :model="form">
      <el-form-item :label-width="formLabelWidth" label="Name">
        <el-input id="filename" v-model="form.name"/>
      </el-form-item>

      <el-form-item :label-width="formLabelWidth" label="Language">
        <el-select
          id="selectLanguage"
          v-model="form.language"
          placeholder="Please select a language"
        >
          <el-option
            v-for="name in contractLanguages"
            :key="name.value"
            :label="name.label"
            :value="name.value"
            class="contractLanguageOption"
          />
        </el-select>
      </el-form-item>

      <!-- <el-form-item :label-width="formLabelWidth" label="Compiler Version">
        <el-select
          id="selectVersion"
          v-model="form.compiler"
          placeholder="Please select a version"
        >
          <el-option label="v0.4.9" value="sol-v049" />
        </el-select>
      </el-form-item>-->
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button
        id="cancelCreate"
        class="secondaryButton"
        type="primary"
        @click="$emit('closeDialog')"
      >Cancel</el-button>
      <el-button id="confirmCreate" type="primary" @click="handleFormSubmit">Confirm</el-button>
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
  @Getter('projectTree', { namespace }) public projectTree!: any
  public get isVisible() {
    return this.dialogFormVisible
  }
  public set isVisible(val) {
    this.$emit('closeDialog')
  }
  public form: any = {
    name: '',
    language: '',
    compiler: '',
  }
  public formLabelWidth: string = '200px'
  public contractLanguages: any[] = [
    { label: 'Solidity', value: 'solidity' },
    { label: 'SolidityX', value: 'solidityx' },
    { label: 'Vyper', value: 'vyper' },
    { label: 'Java', value: 'java' },
  ]

  public handleFormSubmit(d: any): void {
    let formValid = true
    let errorMessage = ''
    this.projectTree.folders[0].files.map((file: File) => {
      if (file.name === this.form.name) {
        formValid = false
        errorMessage = 'A file with that name already exists'
      }
    })

    if (this.form.name === '') {
      formValid = false
      errorMessage = 'Please enter a file name'
    }

    if (formValid) {
      this.addFile(this.form.name)
      this.form.name = ''
      this.$emit('closeDialog')
    } else {
      this.$notify.error({
        title: 'Error',
        message: errorMessage,
      })
      this.form.name = ''
      formValid = true
    }
  }
}
</script>
