<template>
    <codemirror :style="{ height: height >0 && height + 'px' }" class="codemirror" ref="myCm" :value="code" :options="editorOptions" @ready="onCmReady" @focus="onCmFocus" @input="onCmCodeChange" @gutterClick="onGutterClick">
    </codemirror>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/monokai.css'
import 'codemirror/mode/javascript/javascript.js'
import { State, Mutation, Getter } from 'vuex-class'
import { EditorOptions } from '../store/types'
const namespace: string = 'workspace'

@Component({
    components: {
        codemirror
    }
})

export default class Editor extends Vue {
    @Getter('code', { namespace }) public code!: string
    @Getter('editorOptions', { namespace }) public editorOptions!: EditorOptions
    @Mutation('setActiveFileContent', { namespace }) public setActiveFileContent: any
    @Prop(Number) public height!:number

    public mounted(): void {
        const { codemirror: codemirrorRef }: any = this.$refs.myCm
        console.log('this is current codemirror object', codemirrorRef, this.editorOptions, this.code, this.height)
    }

    public onCmReady(cm: any) {
        console.log('the editor is readied!', cm)
    }

    public onCmFocus(cm: any) {
        console.log('the editor is focus!', cm)
    }

    public onCmCodeChange(code: any) {
        console.log('this is new code', code)
        this.setActiveFileContent(code)
    }

    public onGutterClick(cm: any, n: any) {
        const info = cm.lineInfo(n)
        console.log(info)
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
