<template>
    <codemirror class="codemirror" ref="myCm" :value="state.code" :options="state.cmOptions" @ready="onCmReady" @focus="onCmFocus" @input="onCmCodeChange" @gutterClick="onGutterClick">
    </codemirror>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/monokai.css'
import 'codemirror/mode/javascript/javascript.js'
import { State, Mutation } from 'vuex-class'
import { EditorState } from '../store/types'
const namespace: string = 'editor'

@Component({
    components: {
        codemirror
    }
})

export default class Editor extends Vue {
    @State('editor') public state !: EditorState
    @Mutation('changeCode', {namespace}) public changeCode: any

    public mounted(): void {
        const { codemirror: codemirrorRef }: any = this.$refs.myCm
        console.log('this is current codemirror object', codemirrorRef)
    }

    public onCmReady(cm: any) {
      console.log('the editor is readied!', cm)
    }

    public onCmFocus(cm: any) {
      console.log('the editor is focus!', cm)
    }

    public onCmCodeChange(code: any) {
      console.log('this is new code', code)
      this.changeCode(code)
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
</style>
