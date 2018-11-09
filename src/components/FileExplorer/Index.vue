<template>
  <div>
    <p>File Explorer</p>
    <el-tree :data="data" node-key="id" default-expand-all @node-drag-start="handleDragStart" @node-drag-enter="handleDragEnter" @node-drag-leave="handleDragLeave" @node-drag-over="handleDragOver" @node-drag-end="handleDragEnd" @node-drop="handleDrop" @node-click="handleNodeClick" draggable :allow-drop="allowDrop" :allow-drag="allowDrag">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <Item :data="data" />
      </span>
    </el-tree>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator'
  import { State, Mutation, Getter } from 'vuex-class'
  import { EditorOptions, ActiveFile, File } from '../../store/types'
  import Item from './Item.vue'
  const namespace: string = 'workspace'

  @Component({
    components: {
      Item
    }
  })
  export default class FileExplorer extends Vue {
    @Getter('code', {namespace}) public code!: any
    @Getter('fileById', {namespace}) public fileById!: any
    @Mutation('setActiveFileContent', { namespace }) public setActiveFileContent: any
    
    private id = 1000
    
    private data = [{
        id: 1,
        label: 'Level one 1',
        type: 'folder',
        children: [{
          id: 4,
          label: 'Level two 1-1',
          type: 'folder',
          children: [{
            id: 9,
            label: 'Level three 1-1-1',
            type: 'file',
          }, {
            id: 10,
            label: 'Level three 1-1-2',
            type: 'file',
          }]
        }]
      }, {
        id: 2,
        label: 'Level one 2',
        type: 'folder',
        children: [{
          id: 5,
          label: 'Level two 2-1',
          type: 'file',
        }, {
          id: 6,
          label: 'Level two 2-2',
          type: 'file',
        }]
      }, {
        id: 3,
        label: 'Level one 3',
        type: 'folder',
        children: [{
          id: 7,
          label: 'Level two 3-1',
          type: 'file',
        }, {
          id: 8,
          label: 'Level two 3-2',
          type: 'file',
        }]
      }]
    
    private defaultProps = {
      children: 'children',
      label: 'label'
    }
    
    public mounted(): void {
      console.log('FileExplorer Mounted')
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
      // console.log(data)
      const nodeId = data.id
      const file: File = this.fileById(0, nodeId)
      // console.log(file.code)
      this.setActiveFileContent(file.code)
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
        
    public renderContent(h: any, { node, data, store }: any) {
      return `<Item :data="data" />`
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