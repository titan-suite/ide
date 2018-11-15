<template>
  <div class="enableFocus">
    <el-tree :data="data" :allow-drag="allowDrag" :allow-drop="allowDrop" node-key="id" default-expand-all draggable @node-click="handleNodeClick">
      <span slot-scope="{ node, data }" class="custom-tree-node">
        <span>{{ node.label }}</span>
        <Item :data="data" :node="node" :handle-click="handleItemClick" />
      </span>
    </el-tree>
    <span class="dialog">
      <FileDialog :dialog-form-visible="dialogFormVisible" @dialogFormVisible="dialogFormVisible=false" />
    </span>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { State, Mutation, Getter } from 'vuex-class'
import { EditorOptions, File, Folder, Tree } from '../../store/types'
import Item from './Item.vue'
import FileDialog from './FileDialog.vue'
const namespace = 'workspace'

@Component({
    components: {
        Item,
        FileDialog
    }
})
export default class FileExplorer extends Vue {
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

    @Watch('dialogFormVisible', { immediate: true, deep: true })
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
        if (dropNode.data.label === 'Level two 3-1') {
            return type !== 'inner'
        } else {
            return true
        }
    }

    public allowDrag(draggingNode: any) {
        return draggingNode.data.label.indexOf('Level three 3-1-1') === -1
    }

    public prepareData(folders: Folder[]): any {
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
      if (action === 'add') {
          this.dialogFormVisible = true
      } else {
          const parent = node.parent
          const children = parent.data.children || parent.data
          const index = children.findIndex((d: any) => d.id === data.id)
          children.splice(index, 1)
          // TODO remove from projectTree
      }
    }

}
</script>

<style>
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
</style>