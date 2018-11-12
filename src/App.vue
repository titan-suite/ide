<template>
  <el-container class="main">
    <el-header height="2rem" class="tempColorWhite">Titan</el-header>
    <el-container>
      <el-aside width="auto">
        <vue-draggable-resizable :draggable="false" :handles="['mr']" drag-cancel=".enableFocus" class="tempColorWhite fileExplorerContainer" style=" height: 98%;margin-right:16px;position: relative;" axis="x">
          <FileExplorer />
        </vue-draggable-resizable>
      </el-aside>
      <el-container>
        <el-main style="padding:0">
          <el-tabs v-model="openTabValue" type="border-card" style="border:none;box-shadow:none;" editable @edit="handleTabsEdit">
            <el-tab-pane v-for="(item) in openTabs" :key="item.name" :label="item.title" :name="item.name">
              <el-main class="editor">
                <Editor :height="height" :code="item.content" />
              </el-main>
            </el-tab-pane>
          </el-tabs>
        </el-main>
        <el-footer height="auto" style="padding:0">
          <vue-draggable-resizable :active="true" :draggable="false" :h="100" :handles="['tm']" class="tempColorWhite consoleContainer" axis="y" style="width: 100%; top:0;z-index: 1000;
                                     display: flex;border: 1px solid #ffab00; position: relative;" @resizestop="onResizstop">
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
import Editor from './components/Editor.vue'
import Console from './components/Console.vue'
import FileExplorer from './components/FileExplorer/Index.vue'
import Sidebar from './components/Sidebar/Index.vue'
import VueDraggableResizable from 'vue-draggable-resizable'
import { State, Mutation, Getter } from 'vuex-class'
import { EditorOptions, ActiveFile, File, Folder } from './store/types'

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
    @Getter('openFiles', { namespace }) public openFiles!: any

    public height: number = 0
    public openTabValue!: string
    public openTabs: any[] = []

    public tabIndex: number = 2
    @Watch('openFiles', { immediate: true, deep: true })
    public onFileUpdate(newFiles: File[], oldFiles: File[]) {
        console.log('old', oldFiles)
        console.log('new', newFiles)
        this.openTabs = this.renderTabs(newFiles)
        // this.$forceUpdate()
        console.log(this.openTabs)
        this.openTabValue = this.openTabs[this.openTabs.length - 1].name
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
        // console.log({ top, height })
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
  height: 100%;
}

.tempColorWhite {
  color: white;
}
</style>