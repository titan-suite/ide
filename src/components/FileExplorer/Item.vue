<template>
    <span v-if="data.type === 'folder'">
        <!-- <el-button icon="el-icon-circle-plus" size="mini" @click="() => append(data, 'folder')" circle></el-button> -->
        <el-button icon="el-icon-plus" size="mini" @click="handleClick(action='add', data, type='file')" circle></el-button>
        <el-button icon="el-icon-delete" size="mini" @click="handleClick(action='remove', data, node)" circle></el-button>
    </span>

    <span v-else-if="data.type === 'file'">
        <el-button icon="el-icon-delete" size="mini" @click="handleClick(action='remove', data, node)" circle></el-button>
    </span>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
@Component
export default class Item extends Vue {
    @Prop(Object) public data!: object
    @Prop(Object) public node!: object
    @Prop(Function) public handleClick: any

    private id = 1000

    // public mounted(): void {
        // console.log('Item Mounted ', this.data, this.node)
    // }

    // public append(data: any, type: string): void {
    //   const newChild = {
    //     id: this.id++,
    //     label: 'testtest',
    //     type,
    //     children: [],
    //   }
    //   if (!data.children) {
    //     this.$set(data, 'children', [])
    //   }
    //   data.children.push(newChild)
    // }
    
    // public remove(node: any, data: any): void {
    //   console.dir(node, data)
    //   const parent = node.parent
    //   const children = parent.data.children || parent.data
    //   const index = children.findIndex((d: any) => d.id === data.id)
    //   children.splice(index, 1)
    // }
}
</script>
