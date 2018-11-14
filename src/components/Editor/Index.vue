<template>
  <codemirror ref="myCm" :value="code" :options="editorOptions" :style="{ height: height >0 && height + 'px' }" class="codemirror" @input="onCmCodeChange" @gutterClick="onGutterClick" />
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/monokai.css'
import 'codemirror/mode/javascript/javascript.js'
import { State, Mutation, Getter } from 'vuex-class'
import { EditorOptions } from '../../store/types'
const namespace = 'workspace'

@Component({
    components: {
        codemirror
    }
})

export default class Editor extends Vue {
    // @Getter('code', { namespace }) public code!: string
    @Getter('editorOptions', { namespace }) public editorOptions!: EditorOptions
    @Mutation('setActiveFileCode', { namespace }) public setActiveFileCode: any
    @Prop(Number) public height!: number
    @Prop(String) public code!: string

    // public mounted(): void {
    //     const { codemirror: codemirrorRef }: any = this.$refs.myCm
    // }

    public onCmCodeChange(code: any) {
        this.setActiveFileCode(code)
    }

    public onGutterClick(cm: any, n: any) {
        const info = cm.lineInfo(n)
        cm.setGutterMarker(n, 'breakpoints', info.gutterMarkers ? null : this.makeMarker())
    }

    public makeMarker() {
        const marker = document.createElement('div')
        marker.style.color = '#fff'
        marker.innerHTML = '●'
        return marker
    }
}
</script>

<style scoped lang="stylus">
.codemirror {
    width: 100%;
}
</style>
