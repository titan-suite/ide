<template>
  <el-container class="main">
    <el-aside width="auto">
      <vue-draggable-resizable style=" height: 100%;margin-right:16px; border: 1px solid red; position: relative;" :draggable="false" axis="x" :handles="['mr']">
        <FileExplorer />
      </vue-draggable-resizable>
    </el-aside>
    <el-container>
      <el-header height="1rem">Header</el-header>
      <el-tabs v-model="openTabValue" type="border-card" editable @edit="handleTabsEdit">
        <el-tab-pane v-for="(item) in openTabs" :key="item.name" :label="item.title" :name="item.name">
          <el-main class="editor">
            <Editor :height="height" :code="item.content" />
          </el-main>
        </el-tab-pane>
      </el-tabs>
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
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import Editor from './components/Editor.vue'
import Console from './components/Console.vue'
import FileExplorer from './components/FileExplorer/Index.vue'
import Sidebar from './components/Sidebar/Index.vue'
import VueDraggableResizable from 'vue-draggable-resizable'
import { State, Mutation, Getter } from 'vuex-class'
  import { EditorOptions, ActiveFile, File, Folder } from './store/types'

const namespace: string = 'workspace'

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
    @Getter('openFiles', {namespace}) public openFiles!: any

    public height: number = 0
    public openTabValue!: string
    public openTabs: any[] =  [/*{
          title: 'Tab 1',
          name: '1',
          content: 'Tab 1 content'
        }, {
          title: 'Tab 2',
          name: '2',
          content: 'Tab 2 content'
        }*/]

    public tabIndex: number = 2
    @Watch('openFiles', {immediate: true, deep: true})
    public onFileUpdate(newFiles: File[], oldFiles: File[]) {
      console.log('old',oldFiles)
      console.log('new',newFiles)
      this.openTabs = this.renderTabs(newFiles)
      // this.$forceUpdate()
      console.log(this.openTabs)
      this.openTabValue = this.openTabs[this.openTabs.length-1].name
    }

    public mounted(): void {
        console.log('Console Mounted')
        this.openTabs = this.renderTabs(this.openFiles)
        console.log(this.openTabs)
        this.openTabValue = this.openTabs[0].name
    }

    public renderTabs(files: File[]): any[] { // TODO create Tab interface
      return files.map((file: File) => {
        console.log(file)
        return {
          title: file.name,
          name: file.path,
          content: file.code
        }
      })
    }

    public onResizstop(left: number, top: number, width: number, height: number) {
        console.log({ top, height })
        // this.height = 1000-height
        // console.log({newHeight:this.height})
    }

    public handleTabsEdit(targetName: string, action: string) {
      if (action === 'add') {
        const newTabName = ++this.tabIndex + ''
        this.openTabs.push({
          title: 'New Tab',
          name: newTabName,
          content: 'New Tab content'
        })
        this.openTabValue = newTabName
      }
      if (action === 'remove') {
        const tabs = this.openTabs
        let activeName = this.openTabValue
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              const nextTab = tabs[index + 1] || tabs[index - 1]
              if (nextTab) {
                activeName = nextTab.name
              }
            }
          })
        }
        
        this.openTabValue = activeName
        this.openTabs = tabs.filter(tab => tab.name !== targetName)
      }
    }

}
</script>


<style lang="stylus">
.main {
  font: 12px / normal 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;
  height: 100vh;
}
</style>
