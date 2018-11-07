<template>
    <p> Run</p>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
@Component
export default class Run extends Vue {
  public mounted(): void {
    console.log('Run Mounted')
  }
}
</script>
