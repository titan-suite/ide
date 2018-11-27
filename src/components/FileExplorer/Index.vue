<template>
  <div class="enableFocus" style="margin-top: 1rem;">
    <el-row>
      <el-col :span="24">
        <el-tree :data="data" :allow-drop="allowDrop" :expand-on-click-node="false" node-key="id" default-expand-all draggable @node-click="handleNodeClick">
          <div slot-scope="{ node, data }" class="custom-tree-node">
            <p id="fileName">{{ node.label }}</p>
            <p v-if="data.type === 'folder'" class="m-top-25">
              <el-button id="collapseLeft" class="secondaryButton" type="primary" icon="el-icon-d-arrow-left" size="mini" circle @click="$emit('collapse')" />
              <el-button id="addFile" type="primary" icon="el-icon-plus" size="mini" circle @click="(e) => handleItemClick(e, {action:'add', data, type:'file'})" />
              <!-- <el-button class="actionButton secondaryButton" type="primary" icon="el-icon-delete" size="mini" circle @click="handleItemClick(action='remove', data, type='file', node)" /> -->
            </p>
            <p v-else-if="data.type === 'file'" class="m-top-25">
              <el-button id="deleteFile" class="actionButton secondaryButton" type="primary" icon="el-icon-delete" size="mini" circle @click="(e) => { handleItemClick(e, {action:'remove', data, node}) }" />
            </p>
          </div>
        </el-tree>
      </el-col>
    </el-row>
    <span class="dialog">
      <FileDialog :dialog-form-visible="dialogFormVisible" @closeDialog="dialogFormVisible = false" />
    </span>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { State, Mutation, Getter, Action } from 'vuex-class'
import { EditorOptions, File, Folder, Tree } from '../../store/types'
import FileDialog from './FileDialog.vue'
const namespace = 'workspace'

@Component({
    components: {
        FileDialog
    }
})
export default class FileExplorer extends Vue {
    @Action('removeFile', { namespace }) public removeFile!: any

    @Getter('code', { namespace }) public code!: any
    @Getter('fileById', { namespace }) public fileById!: any
    @Getter('projectTree', { namespace }) public projectTree!: any

    @Mutation('setActiveFile', { namespace }) public setActiveFile: any
    @Mutation('showTab', { namespace }) public showTab: any
    @Mutation('setSelectedContract', { namespace:'compile' }) public setSelectedContract!: (contractName: string) => void

    public id = 100
    public data = []
    public dialogFormVisible: boolean = false

    public defaultProps = {
        children: 'children',
        label: 'label'
    }

    @Watch('projectTree', { immediate: true, deep: true })
    public onProjectTreeUpdate(oldTree: Tree, newTree: Tree) {
        this.data = newTree && this.prepareData(newTree.folders)
    }

    public mounted(): void {
        this.data = this.prepareData(this.projectTree.folders)
    }

    public handleNodeClick(data: any) {
        if (data.type === 'file') {
            const nodeId = data.id
            const file: File = this.fileById(0, nodeId)
            this.setActiveFile(file)
            this.showTab(file)
            this.setSelectedContract('')
        }
    }

    public allowDrop(draggingNode: any, dropNode: any, type: any) {
        return draggingNode.data.type !== dropNode.data.type
    }

    public prepareData(folders: Folder[]): any { // TODO optimize (dispatch an action ?)
        const data = folders.map(folder => {
            const files = folder.files.map(file => {
                return {
                    id: file.index,
                    label: file.name,
                    type: 'file'
                }
            })

            return {
                id: folder.index,
                label: folder.name,
                type: 'folder',
                children: files
            }
        })
        return data
    }

    public handleItemClick(event: Event, payload: any) {
      const { action, data, type, node } = payload
      event.stopPropagation()

      if (action === 'add') {
        this.dialogFormVisible = true
      } else {
        const parent = node.parent
        const children = parent.data.children || parent.data
        const index = children.findIndex((d: any) => d.id === data.id)
        children.splice(index, 1)
        this.removeFile(data.label)
      }
    }

}
</script>

<style scoped lang="stylus">
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

.m-top-25 {
    margin-top: 25px;
}
</style>