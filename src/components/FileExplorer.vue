<template>
  <div>
    <p>File Explorer</p>
    <el-tree :data="data" node-key="id" default-expand-all @node-drag-start="handleDragStart" @node-drag-enter="handleDragEnter" @node-drag-leave="handleDragLeave" @node-drag-over="handleDragOver" @node-drag-end="handleDragEnd" @node-drop="handleDrop" @node-click="handleNodeClick" draggable :allow-drop="allowDrop" :allow-drag="allowDrag">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <el-button type="text" size="mini" @click="() => append(data)">
            Append
          </el-button>
          <el-button type="text" size="mini" @click="() => remove(node, data)">
            Delete
          </el-button>
        </span>
      </span>
    </el-tree>
  </div>
</template>

<script lang="ts">
  import {
    Component,
    Prop,
    Vue
  } from 'vue-property-decorator'
  import {
    State,
    Mutation,
    Getter
  } from 'vuex-class'
  import {
    EditorOptions
  } from '../store/types'
  const namespace: string = 'workspace'
  @Component
  export default class FileExplorer extends Vue {
    @Mutation('setActiveFileContent', {
      namespace
    }) public setActiveFileContent: any
    private id = 1000
    private data = [{
      label: 'Level one 1',
      children: [{
        label: 'Level two 1-1',
        children: [{
          label: 'Level three 1-1-1'
        }, {
          label: 'Level three 1-1-2'
        }]
      }]
    }, {
      label: 'Level one 2',
      children: [{
        label: 'Level two 2-1'
      }, {
        label: 'Level two 2-2'
      }]
    }, {
      label: 'Level one 3',
      children: [{
        id: 7,
        label: 'Level two 3-1'
      }, {
        id: 8,
        label: 'Level two 3-2'
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
      console.log(data)
      this.setActiveFileContent(data.label)
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
    public append(data: any): void {
      const newChild = {
        id: this.id++,
        label: 'testtest',
        children: []
      }
      if (!data.children) {
        this.$set(data, 'children', [])
      }
      data.children.push(newChild)
    }
    public remove(node: any, data: any): void {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex((d: any) => d.id === data.id)
      children.splice(index, 1)
    }
    public renderContent(h: any, {
      node,
      data,
      store
    }: any) {
      // console.log(store)
      return `<span class="custom-tree-node">
          <span>{node.label}</span>
          <span>
            <el-button size="mini" type="text" on-click={ () => this.append(data) }>Append</el-button>
            <el-button size="mini" type="text" on-click={ () => this.remove(node, data) }>Delete</el-button>
          </span>
        </span>`
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