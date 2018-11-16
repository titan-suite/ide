<template>
  <codemirror ref="myCm" :value="code" :options="editorOptions" :style="{ height: height >0 && height + 'px' }" class="codemirror" @input="onCmCodeChange" @gutterClick="onGutterClick" />
</template>

<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Action, Mutation, Getter, State } from 'vuex-class'
import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/monokai.css'
import 'codemirror/mode/javascript/javascript.js'
import { EditorOptions } from '../../store/types'

const namespace = 'workspace'

@Component({
    components: {
        codemirror
    }
})
export default class Tab extends Vue {
  @Prop(String) public code!: string
  @State('receipts', { namespace }) public receipts!: any
  @Getter('editorOptions', { namespace }) public editorOptions!: EditorOptions
  @Mutation('setActiveFileCode', { namespace }) public setActiveFileCode: any

  public height: number =  0
  
  public parsedReceipt(receipt: any) {
    return Object.keys(receipt).map((j: any) => {
          return {
            key: j,
            value: receipt[j]
          }
        })
  }

    public mounted(): void {
        const { codemirror: codemirrorRef }: any = this.$refs.myCm
    }

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
