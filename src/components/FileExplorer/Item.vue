<template>
  <span v-if="data.type === 'folder'">
    <!-- <el-button icon="el-icon-circle-plus" size="mini" @click="() => append(data, 'folder')" circle></el-button> -->
    <el-button class="actionButton" type="primary" icon="el-icon-plus" size="mini" circle @click="handleClick(action='add', data, type='file')" />
    <el-button class="actionButton" type="info" icon="el-icon-delete" size="mini" circle @click="handleClick(action='remove', data, node)" />
  </span>

  <span v-else-if="data.type === 'file'">
    <el-button class="actionButton" type="info" icon="el-icon-delete" size="mini" circle @click="handleClick(action='remove', data, node)" />
  </span>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
@Component
export default class Item extends Vue {
    @Prop(Object) public data!: object
    @Prop(Object) public node!: object
    @Prop(Function) public handleClick: any

    public id = 1000

}
</script>

<style scoped lang="stylus">
.actionButton {
    margin-top: 0.95rem;
}
</style>