<template>
  <el-container class="main">
    <el-aside width="auto">
      <vue-draggable-resizable style=" height: 100%;margin-right:16px; border: 1px solid red; position: relative;" :draggable="false" axis="x" :handles="['mr']">
        <FileExplorer />
      </vue-draggable-resizable>
    </el-aside>
    <el-container>
      <el-header height="1rem">Header</el-header>
      <el-main>
        <Editor :height="height" />
      </el-main>
      <el-footer height="auto">
        <vue-draggable-resizable @resizestop="onResizstop" style="width: 100%; top:0;display: flex; flex-direction: column;z-index: 1000;
                     display: flex; background: aliceblue;border: 1px solid red; position: relative;" :h="225" :draggable="false" axis="y" :handles="['tm']">
          <Console />
        </vue-draggable-resizable>
      </el-footer>
    </el-container>
    <el-aside width="auto">
      <vue-draggable-resizable style=" height: 100%;left: 1rem; margin-right:16px; border: 1px solid red; position: relative;" :w="415" :draggable="false" axis="x" :handles="['ml']">
        <Sidebar />
      </vue-draggable-resizable>
    </el-aside>
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
    public mounted(): void {
        console.log('Console Mounted')
    }
    public onResizstop(left: number, top: number, width: number, height: number) {
        console.log({ top, height })
        // this.height = 1000-height
        // console.log({newHeight:this.height})
    }
}
</script>


<style lang="stylus">
.main {
  font: 12px / normal 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;
  height: 100vh;
}
</style>
