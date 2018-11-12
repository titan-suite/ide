<template>
  <el-tabs v-model="activeName" class="enableFocus" style="border: none;box-shadow:none;padding: 10px;">
    <el-tab-pane label="Compile" name="first">
      <Compile />
    </el-tab-pane>
    <el-tab-pane label="Run" name="second">
      <Run />
    </el-tab-pane>
    <el-tab-pane label="Accounts" name="third">
      <Accounts />
    </el-tab-pane>
    <el-tab-pane label="Analysis" name="fourth">
      <Analysis />
    </el-tab-pane>
    <el-tab-pane label="Chat" name="fifth">
      <Chat />
    </el-tab-pane>
    <el-tab-pane label="Settings" name="sixth">
      <Settings />
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import Compile from './Compile.vue'
import Run from './Run.vue'
import Analysis from './Analysis.vue'
import Chat from './Chat.vue'
import Settings from './Settings.vue'
import Accounts from './Accounts.vue'
@Component({
    components: {
        Compile,
        Run,
        Analysis,
        Chat,
        Settings,
        Accounts
    }
})
export default class Sidebar extends Vue {
    private activeName: string = 'first'
    public mounted(): void {
        console.log('Sidebar Mounted')
    }
}
</script>

<style lang="stylus">
.enableFocus {
}
</style>
