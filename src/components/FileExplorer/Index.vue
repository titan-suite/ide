<template>
  <div class="enableFocus">
    <el-tree :data="data" :allow-drop="allowDrop" :expand-on-click-node="false" node-key="id" default-expand-all draggable @node-click="handleNodeClick">
      <span slot-scope="{ node, data }" class="custom-tree-node">
        <span>{{ node.label }}</span>
        <span v-if="data.type === 'folder'">
          <el-button class="actionButton" type="primary" icon="el-icon-plus" size="mini" circle @click="handleItemClick(action='add', data, type='file')" />
          <!-- <el-button class="actionButton secondaryButton" type="primary" icon="el-icon-delete" size="mini" circle @click="handleItemClick(action='remove', data, node)" /> -->
        </span>

        <!-- <span v-else-if="data.type === 'file'">
          <el-button class="actionButton secondaryButton" type="primary" icon="el-icon-delete" size="mini" circle @click="handleItemClick(action='remove', data, node)" />
        </span> -->
      </span>
    </el-tree>
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

    public handleItemClick(action: string, data: any, type? : string, node? : any) {
        console.log(action, data, type, node)
        if (action === 'add') {
            this.dialogFormVisible = true
        } else {
            this.removeFile(data.label)
            // const parent = node.parent
            // const children = parent.data.children || parent.data
            // const index = children.findIndex((d: any) => d.id === data.id)
            // children.splice(index, 1)
            // TODO remove from projectTree
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

.enableFocus {
    margin-top: 1rem;
}

.actionButton {
    margin-top: 0.95rem;
}
</style>