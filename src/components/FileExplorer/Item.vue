<template>
    <span v-if="data.type === 'folder'">
        <el-button type="text" size="mini" @click="() => append(data, 'folder')">
            Add Folder
        </el-button>
        <el-button type="text" size="mini" @click="() => append(data, 'file')">
            Add File
        </el-button>
        <el-button type="text" size="mini" @click="() => remove(node, data)">
            Delete
        </el-button>
    </span>

    <span v-else-if="data.type === 'file'">
        <el-button type="text" size="mini" @click="() => remove(node, data)">
            Delete
        </el-button>
    </span>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
@Component
export default class Item extends Vue {
    @Prop(Object) public data!: object

    private id = 1000

    public mounted(): void {
        // console.log('Item Mounted ', this.data)
    }

    public append(data: any, type: string): void {
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
    }
    
    public remove(node: any, data: any): void {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex((d: any) => d.id === data.id)
      children.splice(index, 1)
    }
}
</script>
