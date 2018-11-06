<template>
    <div class="main">
        <codemirror ref="myCm" :value="code" :options="cmOptions" @ready="onCmReady" @focus="onCmFocus" @input="onCmCodeChange" @gutterClick="onGutterClick">
        </codemirror>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/monokai.css'
import 'codemirror/mode/javascript/javascript.js'

@Component({
    components: {
        codemirror
    }
})

export default class Editor extends Vue {
    @Prop() private code!: string
    @Prop() private cmOptions!: {}

    public mounted(): void {
        const { codemirror: codemirrorRef }: any = this.$refs.myCm
        console.log('this is current codemirror object', codemirrorRef)
        console.log(this.code, this.cmOptions)
        // you can use this.codemirror to do something...
    }

    public onCmReady(cm: any) {
      console.log('the editor is readied!', cm)
    }

    public onCmFocus(cm: any) {
      console.log('the editor is focus!', cm)
    }

    public onCmCodeChange(code: any) {
      console.log('this is new code', code)
      this.code = code
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
.main {
    margin: 40px 0 0;
}
</style>
