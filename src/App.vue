<template>

  <el-container class="main">
    <el-header height="1rem">Header</el-header>
    <el-container class="main">

      <el-aside width="auto">
        <vue-draggable-resizable style=" height: 100%;margin-right:16px; border: 1px solid red; position: relative;" :draggable="false" axis="x" :handles="['mr']">
          <FileExplorer />
        </vue-draggable-resizable>
      </el-aside>
      <el-container>
        <el-main>
          <Editor />
          <vue-draggable-resizable style="width: 100%; border: 1px solid red; position: relative;" :draggable="false" axis="y" :handles="['tm']">
            <Console />
          </vue-draggable-resizable>
        </el-main>
      </el-container>
      <el-aside width="auto">
        <vue-draggable-resizable style=" height: 100%;left: 1rem; margin-right:16px; border: 1px solid red; position: relative;" :w="415" :draggable="false" axis="x" :handles="['ml']">
          <Sidebar />
        </vue-draggable-resizable>
      </el-aside>
    </el-container>
  </el-container>
</template>

<script>
import Editor from './components/Editor.vue'
import Console from './components/Console.vue'
import FileExplorer from './components/FileExplorer.vue'
import Sidebar from './components/Sidebar/Index.vue'
import VueDraggableResizable from 'vue-draggable-resizable'
export default {
  name: 'app',
  components: {
    VueDraggableResizable,
    Editor,
    Console,
    FileExplorer,
    Sidebar
  },
  data() {
    return {
    }
  }
}
</script>

<style lang="stylus">
.main {
  font: 12px / normal 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;
}
</style>
