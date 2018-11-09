<template>
  <p> Analysis</p>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
@Component
export default class Analysis extends Vue {
    public mounted(): void {
        console.log('Analysis Mounted')
    }
}
</script>
