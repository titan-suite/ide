<template>
  <el-container class="main">
    <el-aside width="200px">
      <FileExplorer />
    </el-aside>
    <el-container>
      <el-header height="10px">Header</el-header>
      <el-main>
        <Editor :code="code" :cmOptions="cmOptions" />
      </el-main>
      <el-footer>
        <Console />
      </el-footer>
    </el-container>
    <el-aside width="30%">
      <Sidebar />
    </el-aside>
  </el-container>
</template>

<script>
import Editor from './components/Editor.vue'
import Console from './components/Console.vue'
import FileExplorer from './components/FileExplorer.vue'
import Sidebar from './components/Sidebar/Index.vue'
export default {
  name: 'app',
  components: {
    Editor,
    Console,
    FileExplorer,
    Sidebar
  },
  data() {
    return {
      code: `const jokes = "Welcome to Titan's IDe | the #1 mofo ide for mofo hardcore devs";`,
      cmOptions: {
        tabSize: 4,
        mode: 'text/javascript',
        theme: 'monokai',
        lineNumbers: true,
        line: true,
        gutters: ['CodeMirror-linenumbers', 'breakpoints']
      }
    }
  }
}
</script>

<style lang="stylus">
.main
  font:12px/normal 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace
</style>
