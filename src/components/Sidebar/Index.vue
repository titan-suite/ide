<template>
    <p>Sidebar</p>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class Sidebar extends Vue {
  public mounted(): void {
    console.log('Sidebar Mounted')
  }
}
</script>
