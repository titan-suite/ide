<template>
  <div>
    <p>File Explorer</p>
    <el-tree :data="data" node-key="id" default-expand-all @node-drag-start="handleDragStart" @node-drag-enter="handleDragEnter" @node-drag-leave="handleDragLeave" @node-drag-over="handleDragOver" @node-drag-end="handleDragEnd" @node-drop="handleDrop" @node-click="handleNodeClick" draggable :allow-drop="allowDrop" :allow-drag="allowDrag">
    </el-tree>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class FileExplorer extends Vue {
  private data = [{
          label: 'Level one 1',
          children: [{
            label: 'Level two 1-1',
            children: [{
              label: 'Level three 1-1-1'
            }]
          }]
        }, {
          label: 'Level one 2',
          children: [{
            label: 'Level two 2-1',
            children: [{
              label: 'Level three 2-1-1'
            }]
          }, {
            label: 'Level two 2-2',
            children: [{
              label: 'Level three 2-2-1'
            }]
          }]
        }, {
          label: 'Level one 3',
          children: [{
            label: 'Level two 3-1',
            children: [{
              label: 'Level three 3-1-1'
            }]
          }, {
            label: 'Level two 3-2',
            children: [{
              label: 'Level three 3-2-1'
            }]
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
  }

  public allowDrop(draggingNode: any, dropNode: any, type: any) {
    if (dropNode.data.label === 'Level two 3-1') {
      return type !== 'inner'
    } else {
      return true
    }
  }

  public allowDrag(draggingNode:any) {
    return draggingNode.data.label.indexOf('Level three 3-1-1') === -1
  }
}
</script>
