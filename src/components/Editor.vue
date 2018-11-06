<template>
    <div class="hello">
        <el-button>{{ msg }}</el-button>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class Editor extends Vue {
  @Prop() private msg!: string
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
.hello {
    margin: 40px 0 0;
}
</style>
