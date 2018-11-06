<template>
  <div id="app">
    <Editor :code="code" :cmOptions="cmOptions" />
  </div>
</template>

<script>
import Editor from './components/Editor.vue'

export default {
  name: 'app',
  components: {
    Editor
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
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
