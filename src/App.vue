<template>
  <el-container class="main">
    <el-header height="2rem" class="tempColorWhite">Titan</el-header>
    <el-container>
      <el-aside width="auto">
        <vue-draggable-resizable :draggable="false" :handles="['mr']" class="tempColorWhite fileExplorerContainer" style=" height: 100%;margin-right:16px; border: 1px solid #ffab00; position: relative;" axis="x">
          <FileExplorer />
        </vue-draggable-resizable>
      </el-aside>
      <el-container>
        <el-main style="padding:0">
          <Editor :height="height" />
        </el-main>
        <el-footer height="auto" style="padding:0">
          <vue-draggable-resizable :active="true" :draggable="false" :h="225" :handles="['tm']" class="tempColorWhite consoleContainer" axis="y" style="width: 100%; top:0;z-index: 1000;
                         display: flex;border: 1px solid #ffab00; position: relative;" @resizestop="onResizstop">
            <Console />
          </vue-draggable-resizable>
        </el-footer>
      </el-container>
      <el-aside width="auto">
        <vue-draggable-resizable :w="415" :handles="['ml']" :draggable="false" class="tabContainer" drag-cancel=".enableFocus" axis="x" style=" height: 100%;left: 1rem; margin-right:16px; border: 1px solid #ffab00; position: relative;">
          <Sidebar />
        </vue-draggable-resizable>
      </el-aside>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import Editor from './components/Editor.vue'
import Console from './components/Console.vue'
import FileExplorer from './components/FileExplorer/Index.vue'
import Sidebar from './components/Sidebar/Index.vue'
import VueDraggableResizable from 'vue-draggable-resizable'
@Component({
    components: {
        Editor,
        Console,
        FileExplorer,
        Sidebar,
        VueDraggableResizable,
    }
})
export default class App extends Vue {
    public height: number = 0
    public onResizstop(left: number, top: number, width: number, height: number) {
        // console.log({ top, height })
        // this.height = 1000-height
        // console.log({newHeight:this.height})
    }
}
</script>


<style lang="stylus">
.main {
  height: 100%;
}

.tempColorWhite {
  color: white;
}
</style>
