<template>
  <div id="app">
    <Editor :code="code" :cmOptions="cmOptions" />
    <Console />
    <FileExplorer />
    <Sidebar />
  </div>
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

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
