<template>
    <el-tabs v-model="openTabValue" type="border-card" style="border:none;box-shadow:none;" editable @edit="handleTabsEdit">
        <el-tab-pane v-for="(item) in openFiles" :key="item.path" :label="item.name" :name="item.name" lazy>
            <el-main class="editor">
                <Tab :code="item.code" />
            </el-main>
        </el-tab-pane>
    </el-tabs>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { State, Mutation, Getter } from 'vuex-class'
import { File, Folder } from '../../store/types'
import Tab from './Tab.vue'

const namespace = 'workspace'

@Component({
    components: {
        Tab
    }
})

export default class Editor extends Vue {
    @Getter('activeFile', { namespace }) public activeFile!: File
    @Getter('fileById', { namespace }) public fileById!: any
    @Getter('openFiles', { namespace }) public openFiles!: any
    @Mutation('setActiveFile', { namespace }) public setActiveFile!: any
    @Mutation('setOpenFiles', { namespace }) public setOpenFiles!: any

    get openTabValue() {
        const open = this.activeFile.name
        return open
    }
    
    set openTabValue(fileName: string) {
        this.openFiles.forEach((file: File, index: number) => {
            if(file.name === fileName) {
                this.setActiveFile(file)
                return
            }
        })
    }

    public handleTabsEdit(targetName: string, action: string) {        
        if (action === 'remove') {
            const tabs = this.openFiles
            let activeName = this.openTabValue
            let activeIndex = 0
            if (activeName === targetName) {
                tabs.forEach((tab: File, index: number) => {
                    if (tab.name === targetName) {
                        const nextTab = tabs[index + 1] || tabs[index - 1]
                        if (nextTab) {
                            activeName = nextTab.name
                            activeIndex = nextTab.index
                        }
                    }
                })
            }
            const newTabs = tabs.filter((tab: File) => tab.name !== targetName)
            this.setOpenFiles(newTabs)
            this.openTabValue = activeName
        }
    }
}
</script>
