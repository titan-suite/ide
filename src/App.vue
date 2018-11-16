<template>
  <el-container style="height:100%">
    <el-header
      height="4rem"
      style="height: 5rem;
        box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 4px -1px, rgba(0, 0, 0, 0.14) 0px 4px 5px 0px, rgba(0, 0, 0, 0.12) 0px 1px 10px 0px;
        color: white;
        background-color: #2b2b2b00;
        z-index: 1100;
        box-sizing: border-box;
        margin-bottom: 1.2rem;
        width: 100%;"
    >
      <el-row type="flex">
        <div
          class="titan-mine"
          style="-webkit-animation: titan-mine infinite 5s linear alternate;animation:titan-mine infinite 5s linear alternate;margin:7px"
        >
          <img alt="logo" src="./assets/logo.png" height="50px" width="50px" >
        </div>

        <h2
          style="flex-grow: 1;margin-left: 15px;margin-top: 25px;font-size: 1.569em !important;font-weight: 500;line-height: 1.16667em;"
        >
          TITAN IDE
        </h2>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="auto">
        <vue-draggable-resizable
          v-show="!fileExplorerCollapse"
          :draggable="false"
          :w="225"
          :handles="['mr']"
          drag-cancel=".enableFocus"
          class="fileExplorerContainer"
          style="height: 98%;margin-right:16px;position: relative;"
          axis="x"
        >
          <FileExplorer @collapse="fileExplorerCollapse = true" />
        </vue-draggable-resizable>
        <el-button
          v-show="fileExplorerCollapse"
          class="actionButton secondaryButton"
          type="primary"
          icon="el-icon-d-arrow-right"
          size="mini"
          circle
          style="margin-right: 1rem;margin-left: 1rem; margin-top: 0.5rem;"
          @click="fileExplorerCollapse = false"
        />
      </el-aside>
      <el-container>
        <el-main style="padding:0"> <Editor /> </el-main>
        <el-footer height="auto" style="padding:0">
          <vue-draggable-resizable
            :active="true"
            :draggable="false"
            :h="100"
            :handles="['tm']"
            drag-cancel=".enableFocus"
            class="consoleContainer"
            axis="y"
            style="width: 100%; top:0;z-index: 1000;display: flex;position: relative;"
          >
            <Console />
          </vue-draggable-resizable>
        </el-footer>
      </el-container>
      <el-aside width="auto">
        <vue-draggable-resizable
          v-show="!sidebarCollapse"
          :w="430"
          :handles="['ml']"
          :draggable="false"
          class="tabContainer"
          drag-cancel=".enableFocus"
          axis="x"
          style="height:98%;left: 1rem; margin-right:16px;position: relative;"
        >
          <i
            class="el-icon-d-arrow-right iconButton secondaryButton"
            style="position: absolute;"
            @click="sidebarCollapse = true"
          />
          <Sidebar />
        </vue-draggable-resizable>
        <el-button
          v-show="sidebarCollapse"
          class="actionButton secondaryButton"
          type="primary"
          icon="el-icon-d-arrow-left"
          size="mini"
          circle
          style="right: 1rem;position: absolute;float: right;"
          @click="sidebarCollapse = false"
        />
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
    VueDraggableResizable
  }
})
export default class App extends Vue {
  public fileExplorerCollapse: boolean = false
  public sidebarCollapse: boolean = false
}
</script>
