<template>
  <div>
    <p>File Explorer</p>
    <el-tree :data="data" node-key="id" default-expand-all @node-drag-start="handleDragStart" @node-drag-enter="handleDragEnter" @node-drag-leave="handleDragLeave" @node-drag-over="handleDragOver" @node-drag-end="handleDragEnd" @node-drop="handleDrop" @node-click="handleNodeClick" draggable :allow-drop="allowDrop" :allow-drag="allowDrag">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <Item :data="data" :node="node" :handleClick="handleItemClick" />
      </span>
    </el-tree>
    <span class="dialog">
      <FileDialog :dialogFormVisible="dialogFormVisible" />
    </span>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
  import { State, Mutation, Getter } from 'vuex-class'
  import { EditorOptions, ActiveFile, File, Folder } from '../../store/types'
  import Item from './Item.vue'
  import FileDialog from './FileDialog.vue'
  const namespace: string = 'workspace'

  @Component({
    components: {
      Item,
      FileDialog
    }
  })
  export default class FileExplorer extends Vue {
    @Getter('code', {namespace}) public code!: any
    @Getter('fileById', {namespace}) public fileById!: any
    @Getter('projectTree', {namespace}) public projectTree!: any
    @Mutation('setActiveFileContent', { namespace }) public setActiveFileContent: any
    @Mutation('showTab', { namespace }) public showTab: any
    
    private id = 100
    private data = []
    private dialogFormVisible: boolean = false
    
    private defaultProps = {
      children: 'children',
      label: 'label'
    }
    
    @Watch('dialogFormVisible', {immediate: true, deep: true})
    public onToggleDialog(oldState: any, newState: any) {
      console.log(oldState)
      console.log(newState)
    }
    
    public mounted(): void {
      console.log('FileExplorer Mounted')
      this.data = this.prepareData(this.projectTree.folders)
      // this.dialogFormVisible = false
    }
    
    public handleDragStart(node: any, ev: any) {
      console.log('drag start', node)
    }
    
    public handleDragEnter(draggingNode: any, dropNode: any, ev: any) {
      console.log('tree drag enter: ', dropNode.label)
    }
    
    public handleDragLeave(draggingNode: any, dropNode: any, ev: any) {
      console.log('tree drag leave: ', dropNode.label)
    }
    
    public handleDragOver(draggingNode: any, dropNode: any, ev: any) {
      console.log('tree drag over: ', dropNode.label)
    }
    
    public handleDragEnd(draggingNode: any, dropNode: any, dropType: any, ev: any) {
      console.log('tree drag end: ', dropNode && dropNode.label, dropType)
    }
    
    public handleDrop(draggingNode: any, dropNode: any, dropType: any, ev: any) {
      console.log('tree drop: ', dropNode.label, dropType)
    }
    
    public handleNodeClick(data: any) {
      console.log(data)
      if(data.type === 'file') {
        const nodeId = data.id
        console.log(nodeId)
        const file: File = this.fileById(0, nodeId)
        console.log(file.code)
        // const payload = {folderIndex: 0, fileIndex: nodeId, code: file.code}
        // this.setActiveFileContent(payload)
        this.showTab(nodeId)
      }
    }
    
    public allowDrop(draggingNode: any, dropNode: any, type: any) {
      console.log(draggingNode, dropNode)
      if (dropNode.data.label === 'Level two 3-1') {
        return type !== 'inner'
      } else {
        return true
      }
    }
    
    public allowDrag(draggingNode: any) {
      console.log(draggingNode)
      return draggingNode.data.label.indexOf('Level three 3-1-1') === -1
    }

    public prepareData(folders: Folder[]): any {
      // console.log(folders)

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
      // console.log(data)

      return data
    }
    
    public handleItemClick(action: string, data: any, type?: string, node?: any) {
      if(action === 'add') {
        console.log('adding new node')
        this.dialogFormVisible = true
        console.log(this.dialogFormVisible)
        const newChild = {
          id: this.id++,
          label: 'testtest',
          type,
          children: [],
        }
        if (!data.children) {
          this.$set(data, 'children', [])
        }
        data.children.push(newChild)
      } else {
        const parent = node.parent
        const children = parent.data.children || parent.data
        const index = children.findIndex((d: any) => d.id === data.id)
        children.splice(index, 1)
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
</style>