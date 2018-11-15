<template>
  <el-container class="main">
    <el-header height="2rem" class="tempColorWhite">Titan IDE</el-header>
    <el-container>
      <el-aside width="auto">
        <vue-draggable-resizable :draggable="false" :handles="['mr']" drag-cancel=".enableFocus" class="tempColorWhite fileExplorerContainer" style=" height: 98%;margin-right:16px;position: relative;" axis="x">
          <FileExplorer />
        </vue-draggable-resizable>
      </el-aside>
      <el-container>
        <el-main style="padding:0">
          <Editor :height="height" />
        </el-main>
        <el-footer height="auto" style="padding:0">
          <vue-draggable-resizable :active="true" :draggable="false" :h="100" :handles="['tm']" class="tempColorWhite consoleContainer" axis="y" style="width: 100%; top:0;z-index: 1000;
                                     display: flex;border: 1px solid #ffab00; position: relative;">
            <Console />
          </vue-draggable-resizable>
        </el-footer>
      </el-container>
      <el-aside width="auto">
        <vue-draggable-resizable :w="430" :handles="['ml']" :draggable="false" class="tabContainer" drag-cancel=".enableFocus" axis="x" style=" height: 98%;left: 1rem; margin-right:16px;  position: relative;">
          <Sidebar />
        </vue-draggable-resizable>
      </el-aside>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import Editor from './components/Editor/Index.vue'
import Console from './components/Console.vue'
import FileExplorer from './components/FileExplorer/Index.vue'
import Sidebar from './components/Sidebar/Index.vue'
import VueDraggableResizable from 'vue-draggable-resizable'

const namespace = 'workspace'

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